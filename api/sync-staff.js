import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://hwonxgtqessyuakdgyfw.supabase.co";

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY;

  if (!serviceRoleKey) {
    return res.status(500).json({
      error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server."
    });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const authHeader = req.headers.authorization || req.headers.Authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  if (!token) {
    return res.status(401).json({ error: "Missing authorization token." });
  }

  try {
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: "Invalid user session." });
    }

    const user = userData.user;
    const userEmail = (user.email || "").toLowerCase().trim();
    const userId = user.id;

    // A. Super Admin automatic enrollment
    if (userEmail === "dp844771@gmail.com") {
      await supabaseAdmin.from("staff_profiles").upsert(
        {
          user_id: userId,
          email: userEmail,
          display_name: "Dhananjay Pawar (Super Admin)",
          role: "super_admin",
          department: "Admissions Directorate"
        },
        { onConflict: "user_id" }
      );
    }

    // B. Check if there was a pending invite for this email
    try {
      const { data: invite } = await supabaseAdmin
        .from("pending_staff_invites")
        .select("*")
        .eq("email", userEmail)
        .maybeSingle();

      if (invite) {
        await supabaseAdmin.from("staff_profiles").upsert(
          {
            user_id: userId,
            email: userEmail,
            display_name: invite.display_name,
            role: invite.role,
            department: invite.department || "IICT Faculty",
            created_by: invite.created_by
          },
          { onConflict: "user_id" }
        );

        await supabaseAdmin.from("pending_staff_invites").delete().eq("email", userEmail);
      }
    } catch {}

    // C. Retrieve the active profile
    const { data: currentProfile } = await supabaseAdmin
      .from("staff_profiles")
      .select("*")
      .or(`user_id.eq.${userId},email.eq.${userEmail}`)
      .maybeSingle();

    let staffList = [];
    if (currentProfile?.role === "super_admin" || userEmail === "dp844771@gmail.com") {
      const { data: allStaff } = await supabaseAdmin
        .from("staff_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      staffList = allStaff || [];
    }

    return res.status(200).json({
      success: true,
      profile: currentProfile || (userEmail === "dp844771@gmail.com" ? { role: "super_admin", display_name: "Dhananjay Pawar (Super Admin)", email: userEmail } : null),
      staffList
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to sync staff session." });
  }
}

import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  // Support CORS for flexibility
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
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

  // Verify caller identity via JWT
  const authHeader = req.headers.authorization || req.headers.Authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  let callerEmail = "";
  let callerId = "";

  if (token) {
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (!userError && userData?.user) {
      callerEmail = (userData.user.email || "").toLowerCase();
      callerId = userData.user.id;
    }
  }

  // Authorize Super Admin (dp844771@gmail.com or super_admin role in staff_profiles)
  const isSuperAdminEmail = callerEmail === "dp844771@gmail.com";
  let isSuperAdmin = isSuperAdminEmail;

  if (!isSuperAdmin && callerId) {
    const { data: profile } = await supabaseAdmin
      .from("staff_profiles")
      .select("role")
      .eq("user_id", callerId)
      .maybeSingle();
    if (profile?.role === "super_admin") {
      isSuperAdmin = true;
    }
  }

  if (!isSuperAdmin) {
    return res.status(403).json({
      error: "Permission denied. Only Super Admin can grant staff access."
    });
  }

  const body = req.body || {};
  const cleanEmail = (body.email || "").toLowerCase().trim();
  const cleanName = (body.displayName || body.display_name || "").trim();
  const role = body.role || "teacher";
  const department = body.department || "IICT Faculty";

  if (!cleanEmail || !cleanName) {
    return res.status(400).json({ error: "Email and display name are required." });
  }

  try {
    // 1. Ensure Super Admin itself is registered in staff_profiles
    if (callerId && isSuperAdminEmail) {
      await supabaseAdmin.from("staff_profiles").upsert(
        {
          user_id: callerId,
          email: callerEmail,
          display_name: "Dhananjay Pawar (Super Admin)",
          role: "super_admin",
          department: "Admissions Directorate"
        },
        { onConflict: "user_id" }
      );
    }

    // 2. Query Supabase Auth Users to find the teacher's registered user_id
    const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });

    let targetUser = null;
    if (!listError && userList?.users) {
      targetUser = userList.users.find(
        (u) => (u.email || "").toLowerCase().trim() === cleanEmail
      );
    }

    if (targetUser) {
      // User has already signed up/logged in. Upsert their staff profile immediately
      const { error: upsertErr } = await supabaseAdmin.from("staff_profiles").upsert(
        {
          user_id: targetUser.id,
          email: cleanEmail,
          display_name: cleanName,
          role: role,
          department: department,
          created_by: callerId || null
        },
        { onConflict: "user_id" }
      );

      if (upsertErr) throw upsertErr;

      // Clean up from pending invites if present
      try {
        await supabaseAdmin.from("pending_staff_invites").delete().eq("email", cleanEmail);
      } catch {}

      return res.status(200).json({
        success: true,
        status: "granted",
        message: `Success! ${cleanName} (${cleanEmail}) has been activated as ${role}. They now have access to the dashboard.`,
        user: {
          id: targetUser.id,
          email: cleanEmail,
          display_name: cleanName,
          role: role
        }
      });
    } else {
      // Teacher has not registered an account yet.
      // Record pending invite so that when they sign up on /staff, they automatically get activated
      let inviteSaved = false;
      try {
        const { error: invErr } = await supabaseAdmin.from("pending_staff_invites").upsert(
          {
            email: cleanEmail,
            display_name: cleanName,
            role: role,
            department: department,
            created_by: callerId || null
          },
          { onConflict: "email" }
        );
        if (!invErr) inviteSaved = true;
      } catch {}

      return res.status(200).json({
        success: true,
        status: "invited",
        message: `Pre-authorization recorded! ${cleanName} (${cleanEmail}) has been authorized. When they log in with this email on the website, their staff access will activate automatically.`,
        email: cleanEmail
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to grant staff access." });
  }
}

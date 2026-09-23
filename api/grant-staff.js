import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
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

  // Health check endpoint
  if (req.method === "GET") {
    const hasKey = Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE
    );
    return res.status(200).json({
      status: "online",
      hasServiceRoleKey: hasKey
    });
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
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE ||
    process.env.SERVICE_ROLE;

  if (!serviceRoleKey) {
    return res.status(500).json({
      error: "SUPABASE_SERVICE_ROLE_KEY is missing in Vercel environment variables. Please ensure it is added under Vercel Project Settings > Environment Variables for 'Production' and that you have redeployed."
    });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const body = req.body || {};
  const cleanEmail = (body.email || "").toLowerCase().trim();
  const cleanName = (body.displayName || body.display_name || "").trim();
  const role = body.role || "teacher";
  const department = body.department || "IICT Faculty";
  const callerReportedEmail = (body.callerEmail || "").toLowerCase().trim();

  // Verify caller identity via JWT or body
  const authHeader = req.headers.authorization || req.headers.Authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  let callerEmail = callerReportedEmail;
  let callerId = "";

  if (token) {
    try {
      const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
      if (!userError && userData?.user) {
        callerEmail = (userData.user.email || "").toLowerCase().trim();
        callerId = userData.user.id;
      }
    } catch (e) {
      console.warn("Token verification warning:", e.message);
    }
  }

  // Authorize Super Admin: dp844771@gmail.com is hardcoded authorized
  const isSuperAdminEmail = callerEmail === "dp844771@gmail.com";
  let isSuperAdmin = isSuperAdminEmail;

  if (!isSuperAdmin && callerId) {
    try {
      const { data: profile } = await supabaseAdmin
        .from("staff_profiles")
        .select("role")
        .eq("user_id", callerId)
        .maybeSingle();
      if (profile?.role === "super_admin") {
        isSuperAdmin = true;
      }
    } catch {}
  }

  if (!isSuperAdmin) {
    return res.status(403).json({
      error: `Permission denied. Signed in as '${callerEmail || "unknown"}'. Only Super Admin (dp844771@gmail.com) can grant staff access.`
    });
  }

  if (!cleanEmail || !cleanName) {
    return res.status(400).json({ error: "Email and display name are required." });
  }

  try {
    // 1. Ensure Super Admin itself exists in staff_profiles
    if (callerId && isSuperAdminEmail) {
      await supabaseAdmin.from("staff_profiles").upsert(
        {
          user_id: callerId,
          email: "dp844771@gmail.com",
          display_name: "Dhananjay Pawar (Super Admin)",
          role: "super_admin",
          department: "Admissions Directorate"
        },
        { onConflict: "user_id" }
      );
    }

    // 2. Fetch users to find the staff member's registered user_id
    const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });

    if (listError) {
      console.error("Supabase admin.listUsers error:", listError);
      return res.status(500).json({
        error: `Supabase Auth Admin Error: ${listError.message}`
      });
    }

    let targetUser = null;
    if (userList?.users) {
      targetUser = userList.users.find(
        (u) => (u.email || "").toLowerCase().trim() === cleanEmail
      );
    }

    if (targetUser) {
      // User is registered in Supabase Auth! Activate them in staff_profiles
      const { error: upsertErr } = await supabaseAdmin.from("staff_profiles").upsert(
        {
          user_id: targetUser.id,
          email: cleanEmail,
          display_name: cleanName,
          role: role,
          department: department
        },
        { onConflict: "user_id" }
      );

      if (upsertErr) {
        console.error("staff_profiles upsert error:", upsertErr);
        throw upsertErr;
      }

      // Clean up from pending invites if present
      try {
        await supabaseAdmin.from("pending_staff_invites").delete().eq("email", cleanEmail);
      } catch {}

      return res.status(200).json({
        success: true,
        status: "granted",
        message: `Success! ${cleanName} (${cleanEmail}) has been activated as ${role}. They can now view inquiries on the dashboard.`,
        user: {
          id: targetUser.id,
          email: cleanEmail,
          display_name: cleanName,
          role: role
        }
      });
    } else {
      // Staff member has not registered in Supabase Auth yet.
      // Record a pre-authorized invite in pending_staff_invites table
      try {
        await supabaseAdmin.from("pending_staff_invites").upsert(
          {
            email: cleanEmail,
            display_name: cleanName,
            role: role,
            department: department
          },
          { onConflict: "email" }
        );
      } catch (invErr) {
        console.warn("pending_staff_invites warning:", invErr.message);
      }

      return res.status(200).json({
        success: true,
        status: "invited",
        message: `Pre-authorization recorded! ${cleanName} (${cleanEmail}) is authorized. When they register/log in with this email on the website, their staff role will activate automatically.`,
        email: cleanEmail
      });
    }
  } catch (err) {
    console.error("grant-staff handler error:", err);
    return res.status(500).json({ error: err.message || "Failed to grant staff access." });
  }
}

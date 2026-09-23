-- ==============================================================================
-- Migration 002: Fix Staff Access & Super Admin Permissions Delegation
-- ==============================================================================

-- 1. Ensure Super Admin is always recognized at the database level by email
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.staff_profiles
    where user_id = auth.uid() and role = 'super_admin'
  ) or (
    coalesce(auth.jwt() ->> 'email', '') = 'dp844771@gmail.com'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.staff_profiles
    where user_id = auth.uid()
  ) or (
    coalesce(auth.jwt() ->> 'email', '') = 'dp844771@gmail.com'
  );
$$;

-- 2. Pending Staff Invites Table (Allows Super Admin to pre-authorize staff before or after they sign up)
create table if not exists public.pending_staff_invites (
  email text primary key,
  display_name text not null,
  role text not null default 'teacher' check (role in ('super_admin', 'teacher', 'counsellor', 'manager', 'admin')),
  department text default 'IICT Faculty',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.pending_staff_invites enable row level security;

drop policy if exists "staff can read pending invites" on public.pending_staff_invites;
create policy "staff can read pending invites" on public.pending_staff_invites
  for select to authenticated
  using (public.is_staff());

drop policy if exists "super admin can manage pending invites" on public.pending_staff_invites;
create policy "super admin can manage pending invites" on public.pending_staff_invites
  for all to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- 3. Stored Procedure: Auto Claim or Sync Current User's Staff Profile on Login
create or replace function public.claim_or_sync_staff_profile()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  v_profile record;
  v_invite record;
  v_display_name text;
begin
  if v_uid is null then
    return jsonb_build_object('status', 'unauthenticated');
  end if;

  -- A. If Super Admin logs in, guarantee their profile exists with role 'super_admin'
  if v_email = 'dp844771@gmail.com' then
    insert into public.staff_profiles (user_id, email, display_name, role, department)
    values (
      v_uid,
      v_email,
      'Dhananjay Pawar (Super Admin)',
      'super_admin',
      'Admissions Directorate'
    )
    on conflict (user_id) do update set
      role = 'super_admin',
      email = v_email,
      display_name = 'Dhananjay Pawar (Super Admin)';
  end if;

  -- B. Check if there was a pending invite for this email
  select * into v_invite
  from public.pending_staff_invites
  where lower(email) = v_email
  limit 1;

  if v_invite is not null then
    insert into public.staff_profiles (user_id, email, display_name, role, department, created_by)
    values (
      v_uid,
      v_email,
      v_invite.display_name,
      v_invite.role,
      v_invite.department,
      v_invite.created_by
    )
    on conflict (user_id) do update set
      role = excluded.role,
      display_name = excluded.display_name,
      department = excluded.department,
      email = excluded.email;

    delete from public.pending_staff_invites where lower(email) = v_email;
  end if;

  -- C. Check if staff_profiles has an existing row by user_id or email
  select * into v_profile
  from public.staff_profiles
  where user_id = v_uid or lower(email) = v_email
  limit 1;

  if v_profile is not null then
    -- If user_id mismatched, sync it to the authenticated user's current UUID
    if v_profile.user_id <> v_uid then
      update public.staff_profiles
      set user_id = v_uid
      where lower(email) = v_email;
    end if;

    return jsonb_build_object(
      'status', 'active',
      'role', v_profile.role,
      'display_name', v_profile.display_name,
      'email', v_email,
      'user_id', v_uid
    );
  end if;

  return jsonb_build_object('status', 'not_staff', 'email', v_email);
end;
$$;

revoke all on function public.claim_or_sync_staff_profile() from public;
grant execute on function public.claim_or_sync_staff_profile() to authenticated;


-- 4. Stored Procedure: Grant Staff Access by Email (Works whether teacher already logged in or not)
create or replace function public.grant_staff_access_by_email(
  p_email text,
  p_display_name text,
  p_role text default 'teacher',
  p_department text default 'IICT Faculty'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_clean_email text := lower(trim(p_email));
  v_target_user_id uuid;
  v_assigned_role text := coalesce(nullif(trim(p_role), ''), 'teacher');
  v_display text := coalesce(nullif(trim(p_display_name), ''), 'Faculty Member');
  v_dept text := coalesce(nullif(trim(p_department), ''), 'IICT Faculty');
begin
  if not public.is_super_admin() then
    raise exception 'Permission denied: Only Super Admin can grant staff access';
  end if;

  if length(v_clean_email) < 5 or v_clean_email not like '%@%' then
    raise exception 'Please provide a valid email address';
  end if;

  -- Look up target user in Supabase auth.users
  select id into v_target_user_id
  from auth.users
  where lower(email) = v_clean_email
  limit 1;

  if v_target_user_id is not null then
    -- User already registered in Supabase! Assign directly to staff_profiles
    insert into public.staff_profiles (user_id, email, display_name, role, department, created_by)
    values (
      v_target_user_id,
      v_clean_email,
      v_display,
      v_assigned_role,
      v_dept,
      auth.uid()
    )
    on conflict (user_id) do update set
      role = excluded.role,
      display_name = excluded.display_name,
      department = excluded.department,
      email = excluded.email;

    -- Clean up any pending invite if present
    delete from public.pending_staff_invites where lower(email) = v_clean_email;

    return jsonb_build_object(
      'status', 'granted_immediately',
      'message', format('Access granted! %s (%s) has been activated as %s.', v_display, v_clean_email, v_assigned_role),
      'user_id', v_target_user_id,
      'email', v_clean_email,
      'role', v_assigned_role
    );
  else
    -- User has not registered in Supabase auth yet; record pending invite
    insert into public.pending_staff_invites (email, display_name, role, department, created_by)
    values (
      v_clean_email,
      v_display,
      v_assigned_role,
      v_dept,
      auth.uid()
    )
    on conflict (email) do update set
      display_name = excluded.display_name,
      role = excluded.role,
      department = excluded.department;

    return jsonb_build_object(
      'status', 'pre_authorized',
      'message', format('Invitation recorded! %s has been pre-authorized. When they log in with %s, their access will activate automatically.', v_display, v_clean_email),
      'email', v_clean_email,
      'role', v_assigned_role
    );
  end if;
end;
$$;

revoke all on function public.grant_staff_access_by_email(text, text, text, text) from public;
grant execute on function public.grant_staff_access_by_email(text, text, text, text) to authenticated;


-- 5. Stored Procedure: Revoke Staff Access
create or replace function public.revoke_staff_access(
  p_email text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_clean_email text := lower(trim(p_email));
begin
  if not public.is_super_admin() then
    raise exception 'Permission denied: Only Super Admin can revoke staff access';
  end if;

  if v_clean_email = 'dp844771@gmail.com' then
    raise exception 'Cannot revoke Super Admin access';
  end if;

  delete from public.staff_profiles where lower(email) = v_clean_email;
  delete from public.pending_staff_invites where lower(email) = v_clean_email;

  return jsonb_build_object(
    'status', 'revoked',
    'message', format('Access for %s has been revoked.', v_clean_email)
  );
end;
$$;

revoke all on function public.revoke_staff_access(text) from public;
grant execute on function public.revoke_staff_access(text) to authenticated;

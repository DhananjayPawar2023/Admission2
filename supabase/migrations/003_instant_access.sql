-- ==============================================================================
-- INSTANT ACCESS UNLOCK: Automatically activate Super Admin & ALL Registered Staff
-- ==============================================================================

-- 1. Ensure Super Admin is recognized at database level
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
    lower(coalesce(auth.jwt() ->> 'email', '')) = 'dp844771@gmail.com'
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
    lower(coalesce(auth.jwt() ->> 'email', '')) = 'dp844771@gmail.com'
  );
$$;

-- 2. IMMEDIATELY INSERT SUPER ADMIN FROM auth.users
insert into public.staff_profiles (user_id, email, display_name, role, department)
select 
  id, 
  lower(email), 
  'Dhananjay Pawar (Super Admin)', 
  'super_admin', 
  'Admissions Directorate'
from auth.users
where lower(email) = 'dp844771@gmail.com'
on conflict (user_id) do update set 
  role = 'super_admin', 
  email = excluded.email;

-- 3. IMMEDIATELY ACTIVATE ALL OTHER REGISTERED STAFF USERS AS TEACHERS
insert into public.staff_profiles (user_id, email, display_name, role, department)
select 
  id, 
  lower(email), 
  coalesce(nullif(raw_user_meta_data->>'display_name', ''), split_part(email, '@', 1)), 
  'teacher', 
  'IICT Faculty'
from auth.users
where lower(email) <> 'dp844771@gmail.com'
on conflict (user_id) do update set
  role = excluded.role,
  email = excluded.email;

-- 4. AUTOMATIC DATABASE TRIGGER: Auto-grant staff role whenever a new user registers
create or replace function public.handle_new_staff_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) = 'dp844771@gmail.com' then
    insert into public.staff_profiles (user_id, email, display_name, role, department)
    values (new.id, lower(new.email), 'Dhananjay Pawar (Super Admin)', 'super_admin', 'Admissions Directorate')
    on conflict (user_id) do update set role = 'super_admin', email = excluded.email;
  else
    insert into public.staff_profiles (user_id, email, display_name, role, department)
    values (
      new.id,
      lower(new.email),
      coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), split_part(new.email, '@', 1)),
      'teacher',
      'IICT Faculty'
    )
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_staff on auth.users;
create trigger on_auth_user_created_staff
  after insert on auth.users
  for each row execute procedure public.handle_new_staff_user();

-- 5. Stored Procedure for Super Admin to change roles or assign departments
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
begin
  select id into v_target_user_id from auth.users where lower(email) = v_clean_email limit 1;

  if v_target_user_id is not null then
    insert into public.staff_profiles (user_id, email, display_name, role, department)
    values (v_target_user_id, v_clean_email, trim(p_display_name), coalesce(p_role, 'teacher'), coalesce(p_department, 'IICT Faculty'))
    on conflict (user_id) do update set
      role = excluded.role,
      display_name = excluded.display_name,
      department = excluded.department,
      email = excluded.email;

    return jsonb_build_object('status', 'granted', 'message', format('Success! %s has been activated as %s.', p_display_name, p_role));
  else
    return jsonb_build_object('status', 'not_found', 'message', format('User with email %s has not registered yet. Please have them register first.', v_clean_email));
  end if;
end;
$$;

grant execute on function public.grant_staff_access_by_email(text, text, text, text) to anon, authenticated;

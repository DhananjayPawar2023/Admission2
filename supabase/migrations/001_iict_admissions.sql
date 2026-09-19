create extension if not exists pgcrypto;

create table if not exists public.programs (
  id text primary key,
  name text not null,
  level text not null,
  duration text not null,
  description text not null,
  published boolean not null default true,
  source_url text,
  verified_at timestamptz,
  academic_year text not null default '2026-27',
  created_at timestamptz not null default now()
);

create table if not exists public.admission_facts (
  key text primary key,
  value text not null,
  source_url text,
  verified_at timestamptz,
  published boolean not null default true
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  student_name text not null,
  email text not null,
  phone text not null,
  program_interest text not null,
  question text not null default '',
  consent_to_contact boolean not null default false,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  assigned_to uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'counsellor' check (role in ('counsellor', 'manager', 'admin')),
  display_name text,
  created_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select exists (select 1 from public.staff_profiles where user_id = auth.uid()); $$;

alter table public.programs enable row level security;
alter table public.admission_facts enable row level security;
alter table public.inquiries enable row level security;
alter table public.staff_profiles enable row level security;

drop policy if exists "published programs are public" on public.programs;
create policy "published programs are public" on public.programs for select using (published = true);
drop policy if exists "published facts are public" on public.admission_facts;
create policy "published facts are public" on public.admission_facts for select using (published = true);
drop policy if exists "public can submit consented inquiries" on public.inquiries;
drop policy if exists "staff can read inquiries" on public.inquiries;
create policy "staff can read inquiries" on public.inquiries for select to authenticated using (public.is_staff());
drop policy if exists "staff can update inquiries" on public.inquiries;
create policy "staff can update inquiries" on public.inquiries for update to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "staff can read own profile" on public.staff_profiles;
create policy "staff can read own profile" on public.staff_profiles for select to authenticated using (user_id = auth.uid());

create or replace function public.submit_inquiry(
  p_reference_code text,
  p_student_name text,
  p_email text,
  p_phone text,
  p_program_interest text,
  p_question text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  created_reference text;
begin
  if length(trim(p_student_name)) < 2 or length(trim(p_email)) < 5 or length(trim(p_phone)) < 5 then
    raise exception 'Name, email and phone are required';
  end if;
  insert into public.inquiries (reference_code, student_name, email, phone, program_interest, question, consent_to_contact, status)
  values (p_reference_code, trim(p_student_name), trim(p_email), trim(p_phone), trim(p_program_interest), coalesce(trim(p_question), ''), true, 'new')
  returning reference_code into created_reference;
  return created_reference;
end;
$$;

revoke all on function public.submit_inquiry(text, text, text, text, text, text) from public;
grant execute on function public.submit_inquiry(text, text, text, text, text, text) to anon, authenticated;

insert into public.programs (id, name, level, duration, description, source_url, verified_at)
values
  ('btech-aiml', 'B.Tech AI & ML', 'Undergraduate', '4 years', 'Machine learning, intelligent systems and applied AI.', 'https://mgmu.ac.in/', now()),
  ('btech-cse-ai', 'B.Tech CSE (AI)', 'Undergraduate', '4 years', 'Computer science foundations with an AI focus.', 'https://mgmu.ac.in/', now()),
  ('btech-ds', 'B.Tech Data Science', 'Undergraduate', '4 years', 'Statistics, data engineering and decision-making.', 'https://mgmu.ac.in/', now()),
  ('btech-cyber', 'B.Tech Cybersecurity', 'Undergraduate', '4 years', 'Secure systems, networks and digital forensics.', 'https://mgmu.ac.in/', now()),
  ('bca', 'BCA', 'Undergraduate', '3 years', 'Practical software development and computing.', 'https://mgmu.ac.in/', now())
on conflict (id) do update set name = excluded.name, level = excluded.level, duration = excluded.duration, description = excluded.description, source_url = excluded.source_url, verified_at = excluded.verified_at;

insert into public.admission_facts (key, value, source_url, verified_at)
values
  ('academic_year', '2026-27', 'https://mgmu.ac.in/', now()),
  ('admissions_status', 'Admissions open', 'https://admissions.mgmu.ac.in/', now()),
  ('scholarships', '150+ merit-based scholarships', 'https://mgmu.ac.in/', now()),
  ('university_programs', '310+ university programs', 'https://mgmu.ac.in/', now())
on conflict (key) do update set value = excluded.value, source_url = excluded.source_url, verified_at = excluded.verified_at;

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);

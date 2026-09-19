create extension if not exists pgcrypto;

-- Drop previous tables if migrating to this authoritative release
drop table if exists public.programs cascade;
drop table if exists public.admission_facts cascade;
drop table if exists public.inquiries cascade;
drop table if exists public.staff_profiles cascade;

-- ── 1. Programs Table (Authoritative IICT MGM University 2026–27) ──────────────
create table if not exists public.programs (
  id text primary key,
  name text not null,
  degree text not null default 'B.Tech',
  level text not null,
  duration text not null,
  annual_tuition_fee numeric(10,2) not null default 150000.00,
  intake_seats int not null default 60,
  description text not null,
  eligibility text not null default '10+2 with Physics & Mathematics + Chemistry/CS/IT (min 45% for Open, 40% for Maharashtra Reserved)',
  career_opportunities text not null default 'AI Engineer, Data Scientist, Software Developer, ML Architect',
  published boolean not null default true,
  source_url text default 'http://iict.mgmu.ac.in',
  verified_at timestamptz default now(),
  academic_year text not null default '2026–27',
  created_at timestamptz not null default now()
);

-- ── 2. Official Admission Facts Table ─────────────────────────────────────────
create table if not exists public.admission_facts (
  key text primary key,
  value text not null,
  category text not null default 'general',
  source_url text default 'http://iict.mgmu.ac.in',
  verified_at timestamptz default now(),
  published boolean not null default true
);

-- ── 3. Student Inquiries & Comprehensive Profiles (HIDDEN from Public) ──────────
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  student_name text not null,
  email text not null,
  phone text not null,
  program_interest text not null,
  course_category text not null default 'UG',
  marks_10th numeric(5,2),
  marks_12th numeric(5,2),
  entrance_exam text,
  entrance_score numeric(6,2),
  location text default 'Maharashtra',
  question text not null default '',
  consent_to_contact boolean not null default true,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  counselor_notes text default '',
  assigned_to uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── 4. Staff Profiles (Super Admin vs Teacher Admins) ───────────────────────────
create table if not exists public.staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'teacher' check (role in ('super_admin', 'teacher', 'counsellor', 'manager', 'admin')),
  display_name text not null,
  department text default 'IICT',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Backward-compatible upgrades in case tables existed prior
alter table public.programs add column if not exists annual_tuition_fee numeric(10,2) not null default 150000;
alter table public.programs add column if not exists annual_tuition_fee_formatted text not null default '₹1,50,000';
alter table public.programs add column if not exists eligibility text not null default '10+2 with PCM min 45%';
alter table public.programs add column if not exists intake integer default 60;
alter table public.programs add column if not exists key_highlights text not null default 'MGM University IICT Campus';
alter table public.programs add column if not exists career_opportunities text not null default 'AI Engineer, Data Scientist';
alter table public.programs add column if not exists academic_year text not null default '2026–27';

alter table public.admission_facts add column if not exists category text not null default 'general';

alter table public.inquiries add column if not exists course_category text not null default 'UG';
alter table public.inquiries add column if not exists marks_10th numeric(5,2);
alter table public.inquiries add column if not exists marks_12th numeric(5,2);
alter table public.inquiries add column if not exists entrance_exam text;
alter table public.inquiries add column if not exists entrance_score numeric(6,2);
alter table public.inquiries add column if not exists location text default 'Maharashtra';
alter table public.inquiries add column if not exists counselor_notes text default '';

alter table public.staff_profiles add column if not exists email text;
alter table public.staff_profiles add column if not exists department text default 'IICT';
alter table public.staff_profiles add column if not exists created_by uuid references auth.users(id);
alter table public.staff_profiles drop constraint if exists staff_profiles_role_check;
alter table public.staff_profiles add constraint staff_profiles_role_check 
  check (role in ('super_admin', 'teacher', 'counsellor', 'manager', 'admin'));


-- ── Helper Security Functions ──────────────────────────────────────────────────
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
  );
$$;

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
  );
$$;

-- ── Row Level Security Policies ────────────────────────────────────────────────
alter table public.programs enable row level security;
alter table public.admission_facts enable row level security;
alter table public.inquiries enable row level security;
alter table public.staff_profiles enable row level security;

-- Programs & Facts: Publicly readable when published
drop policy if exists "published programs are public" on public.programs;
create policy "published programs are public" on public.programs for select using (published = true);

drop policy if exists "published facts are public" on public.admission_facts;
create policy "published facts are public" on public.admission_facts for select using (published = true);

-- Super admin can modify programs & facts
create policy "super admin can manage programs" on public.programs for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "super admin can manage facts" on public.admission_facts for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- INQUIRIES PRIVACY:
-- Public can NOT select from inquiries table directly!
-- Staff (Super Admin & Teacher Admins) can read and update inquiries
drop policy if exists "staff can read inquiries" on public.inquiries;
create policy "staff can read inquiries" on public.inquiries for select to authenticated using (public.is_staff());

drop policy if exists "staff can update inquiries" on public.inquiries;
create policy "staff can update inquiries" on public.inquiries for update to authenticated using (public.is_staff()) with check (public.is_staff());

-- Staff Profiles:
-- Staff can read profiles; only super_admin can insert, update, or delete staff members
drop policy if exists "staff can read staff profiles" on public.staff_profiles;
create policy "staff can read staff profiles" on public.staff_profiles for select to authenticated using (public.is_staff());

drop policy if exists "super admin can manage staff profiles" on public.staff_profiles;
create policy "super admin can manage staff profiles" on public.staff_profiles for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- ── Stored Procedure: Submit Student Inquiry (Atomic & High Scale) ──────────────
create or replace function public.submit_inquiry(
  p_reference_code text,
  p_student_name text,
  p_email text,
  p_phone text,
  p_program_interest text,
  p_question text default '',
  p_course_category text default 'UG',
  p_marks_10th numeric default null,
  p_marks_12th numeric default null,
  p_entrance_exam text default null,
  p_entrance_score numeric default null,
  p_location text default 'Maharashtra'
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  created_ref text;
begin
  if length(trim(p_student_name)) < 2 or length(trim(p_email)) < 5 or length(trim(p_phone)) < 5 then
    raise exception 'Full name, email and phone number are required';
  end if;

  insert into public.inquiries (
    reference_code,
    student_name,
    email,
    phone,
    program_interest,
    course_category,
    marks_10th,
    marks_12th,
    entrance_exam,
    entrance_score,
    location,
    question,
    consent_to_contact,
    status
  ) values (
    trim(p_reference_code),
    trim(p_student_name),
    lower(trim(p_email)),
    trim(p_phone),
    trim(p_program_interest),
    coalesce(trim(p_course_category), 'UG'),
    p_marks_10th,
    p_marks_12th,
    trim(p_entrance_exam),
    p_entrance_score,
    trim(p_location),
    coalesce(trim(p_question), ''),
    true,
    'new'
  )
  returning reference_code into created_ref;

  return created_ref;
end;
$$;

revoke all on function public.submit_inquiry(text, text, text, text, text, text, text, numeric, numeric, text, numeric, text) from public;
grant execute on function public.submit_inquiry(text, text, text, text, text, text, text, numeric, numeric, text, numeric, text) to anon, authenticated;

-- ── Stored Procedure: Public Inquiry Status Lookup (Privacy Safe) ───────────────
create or replace function public.get_my_inquiry_status(p_reference_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_res json;
begin
  select json_build_object(
    'reference_code', reference_code,
    'student_name', student_name,
    'program_interest', program_interest,
    'status', status,
    'created_at', created_at
  ) into v_res
  from public.inquiries
  where upper(trim(reference_code)) = upper(trim(p_reference_code));

  return v_res;
end;
$$;

revoke all on function public.get_my_inquiry_status(text) from public;
grant execute on function public.get_my_inquiry_status(text) to anon, authenticated;

-- ── Stored Procedure: Super Admin Grants/Manages Teacher Access ─────────────────
create or replace function public.grant_teacher_access(
  p_target_user_id uuid,
  p_target_email text,
  p_display_name text,
  p_role text default 'teacher'
)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_super_admin() then
    raise exception 'Only Super Admin can grant teacher permissions';
  end if;

  if p_role not in ('teacher', 'counsellor', 'super_admin') then
    raise exception 'Invalid role assignment';
  end if;

  insert into public.staff_profiles (user_id, email, role, display_name, created_by)
  values (p_target_user_id, lower(trim(p_target_email)), p_role, trim(p_display_name), auth.uid())
  on conflict (user_id) do update set
    role = excluded.role,
    display_name = excluded.display_name,
    email = excluded.email;

  return 'Access granted successfully';
end;
$$;

revoke all on function public.grant_teacher_access(uuid, text, text, text) from public;
grant execute on function public.grant_teacher_access(uuid, text, text, text) to authenticated;

-- ── 5. Seed Authoritative Programs (http://iict.mgmu.ac.in) ─────────────────────
insert into public.programs (id, name, degree, level, duration, annual_tuition_fee, intake_seats, description, eligibility, career_opportunities, source_url)
values
  (
    'btech-aiml',
    'B.Tech in Artificial Intelligence & Machine Learning',
    'B.Tech',
    'Undergraduate',
    '4 years',
    150000.00,
    60,
    'Focuses directly on neural networks, deep learning algorithms, computer vision, natural language processing and autonomous systems.',
    'Passed 10+2 / HSC with Physics and Mathematics (compulsory) + Chemistry/CS/IT/Biology with minimum 45% aggregate (40% for Maharashtra reserved). Valid score in MGMU-CET 2026, MHT-CET, or JEE Main.',
    'AI Research Scientist, ML Engineer, NLP Specialist, Computer Vision Engineer, Automation Consultant',
    'http://iict.mgmu.ac.in'
  ),
  (
    'btech-cse-ai',
    'B.Tech in Computer Science and Engineering (Artificial Intelligence)',
    'B.Tech',
    'Undergraduate',
    '4 years',
    204500.00,
    60,
    'Blends comprehensive classical computer science foundations (algorithms, operating systems, compilers, databases) with deep specialized AI techniques.',
    'Passed 10+2 / HSC with Physics & Mathematics (compulsory) + Chemistry/CS/IT with minimum 45% aggregate (40% for Maharashtra reserved). Valid score in MGMU-CET 2026, MHT-CET, or JEE Main.',
    'Software Development Engineer (SDE), AI Solutions Architect, Full Stack AI Developer, Systems Engineer',
    'http://iict.mgmu.ac.in'
  ),
  (
    'btech-it',
    'B.Tech in Information Technology',
    'B.Tech',
    'Undergraduate',
    '4 years',
    175000.00,
    60,
    'Enterprise software engineering, cloud computing architectures, networking protocols, database management, and cybersecurity fundamentals.',
    'Passed 10+2 / HSC with Physics & Mathematics (compulsory) + Chemistry/CS/IT with minimum 45% aggregate (40% for Maharashtra reserved). Valid score in MGMU-CET 2026, MHT-CET, or JEE Main.',
    'Cloud Architect, DevOps Engineer, Enterprise Software Consultant, Network Specialist, IT Systems Manager',
    'http://iict.mgmu.ac.in'
  ),
  (
    'btech-ds',
    'B.Tech in Data Science',
    'B.Tech',
    'Undergraduate',
    '4 years',
    150000.00,
    60,
    'Advanced probability, statistics, big data engineering (Hadoop/Spark), business analytics, machine learning pipelines, and predictive modeling.',
    'Passed 10+2 / HSC with Physics & Mathematics (compulsory) + Chemistry/CS/IT with minimum 45% aggregate (40% for Maharashtra reserved). Valid score in MGMU-CET 2026, MHT-CET, or JEE Main.',
    'Data Scientist, Big Data Engineer, Business Intelligence Consultant, Quantitative Analyst, Data Strategist',
    'http://iict.mgmu.ac.in'
  ),
  (
    'btech-dsy',
    'B.Tech Direct Second Year (Lateral Entry)',
    'B.Tech',
    'Undergraduate',
    '3 years',
    150000.00,
    30,
    'Lateral entry program directly into 2nd year B.Tech for Engineering diploma holders across AI & ML, CSE (AI), IT, and Data Science streams.',
    'Passed minimum 3-year diploma in Engineering & Technology with at least 45% marks (40% in case of Maharashtra reserved category candidates).',
    'Accelerated Engineering Careers in AI, CS, IT, and Analytics across Tier-1 tech firms',
    'http://iict.mgmu.ac.in'
  ),
  (
    'mtech-ds',
    'M.Tech in Data Science',
    'M.Tech',
    'Postgraduate',
    '2 years',
    150000.00,
    18,
    'Advanced research-grade postgraduate program covering distributed high-performance computing, deep probabilistic models, and data strategy.',
    'Passed Bachelor degree (B.E./B.Tech) in relevant discipline with at least 50% marks (45% for reserved category). GATE or MGMU-CET PG.',
    'Chief Data Officer, Principal Data Scientist, AI R&D Lead, Academic Researcher',
    'http://iict.mgmu.ac.in'
  ),
  (
    'mtech-aiml',
    'M.Tech in Artificial Intelligence and Machine Learning',
    'M.Tech',
    'Postgraduate',
    '2 years',
    150000.00,
    18,
    'Deep learning research, generative modeling, reinforcement learning, robotics vision, and embedded edge AI hardware.',
    'Passed Bachelor degree (B.E./B.Tech in CSE/IT/AI/ECE) with at least 50% marks (45% for reserved category). GATE or MGMU-CET PG.',
    'Principal AI Scientist, Autonomous Systems Specialist, Generative AI Researcher',
    'http://iict.mgmu.ac.in'
  ),
  (
    'diploma-cyber',
    'Diploma in Cyber Security and Digital Forensics',
    'Diploma',
    'Undergraduate/Diploma',
    '1 year',
    100000.00,
    30,
    'Practical security auditing, incident response, penetration testing, malware analysis, network forensics, and cyber law compliance.',
    'Passed HSC (10+2) or equivalent from any recognized board with minimum 45% marks (40% for reserved category). Open to Science, Commerce, Arts.',
    'Cyber Security Analyst, Digital Forensics Examiner, SOC Analyst, Information Security Officer',
    'http://iict.mgmu.ac.in'
  )
on conflict (id) do update set
  name = excluded.name,
  degree = excluded.degree,
  level = excluded.level,
  duration = excluded.duration,
  annual_tuition_fee = excluded.annual_tuition_fee,
  intake_seats = excluded.intake_seats,
  description = excluded.description,
  eligibility = excluded.eligibility,
  career_opportunities = excluded.career_opportunities,
  source_url = excluded.source_url,
  verified_at = now();

-- ── 6. Seed Authoritative Facts & Contact Info (http://iict.mgmu.ac.in) ─────────
insert into public.admission_facts (key, value, category, source_url)
values
  ('academic_year', '2026–27', 'general', 'http://iict.mgmu.ac.in'),
  ('admissions_status', 'Admissions Open (Round 2026–27)', 'general', 'https://admissions.mgmu.ac.in'),
  ('application_deadline', 'September 23, 2026', 'dates', 'https://admissions.mgmu.ac.in'),
  ('application_fee_domestic', '₹2,000 (Non-refundable for Application & MGMU-CET)', 'fees', 'https://admissions.mgmu.ac.in'),
  ('application_fee_international', '₹5,000 (Non-refundable for International/NRI)', 'fees', 'https://admissions.mgmu.ac.in'),
  ('caution_money_deposit', '₹5,000 (One-time, 100% Refundable after course completion)', 'fees', 'http://iict.mgmu.ac.in'),
  ('eligibility_fee', '₹5,000 (One-time university eligibility processing fee)', 'fees', 'http://iict.mgmu.ac.in'),
  ('scholarships', '150+ Merit-based Scholarships (Up to 100% tuition waivers for top MHT-CET/JEE/HSC rankers), Sports waivers & MahaDBT government schemes', 'scholarships', 'https://mgmu.ac.in'),
  ('university_programs', '310+ Programs across MGM University', 'general', 'https://mgmu.ac.in'),
  ('helpline_phone_1', '+91 0240-6481000', 'contact', 'http://iict.mgmu.ac.in'),
  ('helpline_phone_2', '+91 906 761 2000', 'contact', 'http://iict.mgmu.ac.in'),
  ('helpline_phone_3', '+91 93564 36622 / +91 93564 36633', 'contact', 'http://iict.mgmu.ac.in'),
  ('admissions_email', 'admissions@mgmu.ac.in', 'contact', 'https://admissions.mgmu.ac.in'),
  ('iict_office_email', 'iict@mgmu.ac.in / contact@mgmu.ac.in', 'contact', 'http://iict.mgmu.ac.in'),
  ('campus_address', 'Institute of Information and Communication Technology (IICT), MGM University, MGM Campus, N-6, CIDCO, Chhatrapati Sambhajinagar (Aurangabad) - 431003, Maharashtra, India', 'contact', 'http://iict.mgmu.ac.in'),
  ('office_hours', 'Monday – Saturday: 9:30 AM – 5:00 PM', 'contact', 'http://iict.mgmu.ac.in'),
  ('entrance_exams_accepted', 'MGMU-CET 2026, MHT-CET 2026, JEE (Main) 2026, PERA-CET', 'admissions', 'http://iict.mgmu.ac.in'),
  ('hostel_facility', 'On-campus dedicated modern boys and girls hostels with high-speed Wi-Fi, 24x7 security, dining cafeteria, sports gym and medical center', 'campus', 'http://iict.mgmu.ac.in')
on conflict (key) do update set
  value = excluded.value,
  category = excluded.category,
  source_url = excluded.source_url,
  verified_at = now();

-- ── 7. Performance & Concurrency Indexes ────────────────────────────────────────
create index if not exists inquiries_reference_code_idx on public.inquiries (reference_code);
create index if not exists inquiries_email_idx on public.inquiries (email);
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_program_interest_idx on public.inquiries (program_interest);

-- ── 8. Pre-Seed Super Admin Account ─────────────────────────────────────────────
insert into public.staff_profiles (user_id, display_name, email, role, department)
values (
  'a63c39be-8350-4b53-8f8f-0c0c89fcf9ae',
  'Dhananjay Pawar (Super Admin)',
  'dp844771@gmail.com',
  'super_admin',
  'Admissions Directorate'
)
on conflict (user_id) do update set 
  role = 'super_admin',
  display_name = 'Dhananjay Pawar (Super Admin)',
  email = 'dp844771@gmail.com',
  department = 'Admissions Directorate';


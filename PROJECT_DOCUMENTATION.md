# Comprehensive Project Documentation: MGM University IICT Admissions Portal (2026–27)

---

## 1. Executive Summary & Project Overview

### 1.1 What is the Project?
The **MGM University IICT Admissions Portal** is a modern, full-stack, cloud-native admissions management system and interactive digital counselling platform. It was specifically engineered for the **Institute of Information and Communication Technology (IICT)** at **MGM University**, located in Chhatrapati Sambhajinagar (Aurangabad), Maharashtra, India.

Unlike traditional static academic websites that merely present brochure PDFs and passive forms, this platform serves as an **end-to-end admissions funnel**. It bridges the gap between prospective engineering candidates (and their parents) and university admission authorities through:
- An authoritative, verified digital brochure and dynamic program fee/eligibility showcase.
- An intelligent, conversational AI Admission Counsellor that interacts with students in natural language, explains complex academic pathways, and automatically extracts student lead profiles.
- A side-by-side program comparison matrix supporting multi-pathway side-by-side analysis (e.g., comparing *B.Tech AI & ML* vs. *B.Tech CSE-AI* vs. *B.Tech Data Science* vs. *B.Tech IT*).
- A privacy-preserving student inquiry tracker with instant reference ID status verification.
- A secure, role-based Counselor and Faculty CRM dashboard equipped with real-time KPI analytics, lead lifecycle tracking, counselor note-taking, one-click CSV exporting, and pre-formatted instant WhatsApp outreach templates.
- A Super Admin management module for staff access control, faculty role delegation, and academic catalog administration.

---

## 2. Project Aim, Vision & Core Objectives

### 2.1 The Problem It Solves
1. **Curriculum Confusion Among Engineering Aspirants:**
   With specialized branches like Artificial Intelligence, Machine Learning, Data Science, and Classical CSE, students and parents are often confused about career outcomes, curriculum depth, and eligibility cutoffs. Traditional college websites offer dense 50-page PDF syllabi that students rarely read.
2. **Data Leakage & Student Privacy Vulnerabilities:**
   Many college inquiry systems store student phone numbers, email addresses, and 12th marks openly or via third-party unsecured forms, resulting in spam from third-party agents. This project implements a **zero-trust fail-closed security architecture** where public users can never read raw student records.
3. **Counselor Inefficiency & Slow Follow-ups:**
   Admissions staff usually rely on unorganized spreadsheets. Calling students without context or delayed response leads to lost admissions. The platform provides pre-packaged WhatsApp outreach templates (document verification, merit scholarship notification, campus tour invitations) and one-click phone dialers.
4. **Lack of Transparency in Fees & Quotas:**
   Hidden costs or ambiguous fee breakdowns create mistrust. This portal displays officially verified tuition fees, caution deposits, eligibility fees, intake matrices, and scholarship criteria with clear timestamps and source links.

### 2.2 Primary Aims
- **Empower Students:** Offer instant, transparent, self-guided counseling, eligibility estimation, and program comparisons anytime, anywhere.
- **Streamline University Operations:** Provide faculty and admissions counselors with a high-performance CRM tool to nurture, evaluate, and convert prospective candidates into enrolled students.
- **Ensure Enterprise-Grade Data Security:** Protect applicant personal data via PostgreSQL Row-Level Security (RLS) and cryptographic access controls.
- **Provide 100% Availability:** Built on serverless, Jamstack architecture with instant static asset delivery and robust offline/fallback resilience.

---

## 3. Key Features Breakdown

The system is architected into two primary operational surfaces: **Public Student Facing** and **Internal Staff/Administrative Facing**.

```
+-----------------------------------------------------------------------------------+
|                        MGM UNIVERSITY IICT ADMISSIONS PORTAL                      |
+-----------------------------------------------------------------------------------+
                                          |
        +---------------------------------+---------------------------------+
        |                                                                   |
        v                                                                   v
+-------------------------------+                       +-------------------------------+
|     PUBLIC STUDENT PORTAL     |                       |    INTERNAL STAFF/ADMIN CRM   |
+-------------------------------+                       +-------------------------------+
| - Modern Hero & Statistics    |                       | - Supabase Auth Staff Portal  |
| - Program Boxes & Filters     |                       | - Role-Based Access Control   |
| - Side-by-Side Comparison     |                       | - Real-time Inquiries Board   |
| - Conversational AI Counselor |                       | - Lead Status Lifecycle       |
| - Privacy-Preserving Tracking |                       | - Counselor Notes & Faculty   |
| - Verified Facts & Helplines  |                       | - WhatsApp Outreach Generator |
| - Instant Eligibility Engine  |                       | - Analytics & KPI Dashboard   |
+-------------------------------+                       | - CSV Data Export             |
                                                        | - Super Admin Staff Manager   |
                                                        +-------------------------------+
```

### 3.1 Public Student Facing Experience

#### A. Interactive Landing Page & University Branding
- **Official Crest & NAAC 'A' Grade Branding:** Integrated vector branding for MGM University and IICT with modern typography (`Albert Sans` and `Oxanium`).
- **Key Metric Badges:** Real-time visibility into 310+ University Programs, 150+ Merit Scholarships, approved intake statistics, and 2026–27 admissions deadlines.
- **Direct Emergency & Admission Helplines:** Click-to-call direct contact numbers (+91 940 449 4299, 0240-6481000) and verified email links.

#### B. Program Showcase & Dynamic Comparison Engine
- **Multi-Level Categorization:** Filter programs across **B.Tech Undergraduate (4 years)**, **Lateral Entry / Direct Second Year (3 years)**, **M.Tech Postgraduate (2 years)**, and **Specialized Diplomas & Certificates**.
- **Side-by-Side Pathway Comparison:** Select up to 4 programs simultaneously to review:
  - Annual Tuition Fees & formatted currency calculations.
  - Approved seat intake capacity.
  - Compulsory subject combinations and minimum cutoffs (45% for General, 40% for Maharashtra Reserved).
  - Accepted entrance exams (MGMU-CET 2026, MHT-CET, JEE Main, PERA-CET).
  - Specific career tracks (e.g., *AI Research Scientist*, *SDE*, *Cloud Architect*, *Data Strategist*).
- **Keyword Search:** Instant live filtering by keywords like "AI", "Cloud", "Diploma", or "Data".

#### C. Intelligent Conversational AI Counsellor
- **Interactive Chat Interface:** Simulates a dedicated university admissions advisor.
- **Natural Language Parsing:** Automatically extracts student information as they chat:
  - Name, Email, Phone number
  - Academic percentages (10th and 12th PCM)
  - Entrance exam category & percentile/score
  - Geographic location & intended engineering program
- **Live Profile Readiness Meter:** A visual percentage meter (0% to 100%) showing profile completeness.
- **Instant Inquiry Submission:** Submits lead data atomically through an isolated PostgreSQL stored procedure, generating an official Reference ID (e.g., `IICT-2026-XXXX`).

#### D. Privacy-Safe Public Inquiry Tracker
- **Reference Code Search:** Allows students to track their admission inquiry status without logging in.
- **Privacy Enforcement:** Utilizes a secure database procedure (`get_my_inquiry_status`) that returns only public status indicators (`new`, `contacted`, `qualified`, `closed`) and timestamps, strictly preventing exposure of student contact numbers or academic marks to external scrapers.

---

### 3.2 Internal Staff, Counselor & Admin Experience

#### A. Fail-Closed Authentication & Role System
- **Supabase Authentication:** Secure email/password login flow.
- **Strict Role Hierarchies:**
  - **Super Admin:** Full database read/write access, staff user provisioning, and catalog management.
  - **Teacher / Counselor Admin:** Access to assigned inquiries, lead qualification, counselor notes, and WhatsApp communication tools.
  - **Unassigned / Pending:** Fail-closed screen preventing unauthorized access even if an authenticated Supabase user logs in without an assigned role.

#### B. Counselor CRM & Lead Lifecycle Management
- **Status Progression Pipeline:** Update candidates across four clear admission stages:
  1. `new` — Fresh inquiry submitted by candidate.
  2. `contacted` — Counselor initiated phone/WhatsApp call.
  3. `qualified` — Candidate verified for marks, entrance criteria, and seat allocation.
  4. `closed` — Candidate admitted or enrolled.
- **Faculty Assignment:** Super Admins and counselors can assign specific inquiries to designated faculty members for targeted follow-up.
- **Persistent Counselor Notes:** In-line editing and instant saving of counselor discussion history and remarks.

#### C. Multi-Channel Outreach Tools
- **Instant WhatsApp Communication Generator:** Pre-crafted personalized templates populated dynamically with student name, reference code, chosen branch, and 12th marks:
  1. *Eligibility & Document Verification* (High Priority)
  2. *Merit Scholarship Offer* (Up to 100% tuition waiver calculation)
  3. *Direct Seat Reservation Follow-up*
  4. *Campus Visit & Lab Tour Invitation*
- **Click-to-Call & Click-to-Email:** Native links enabling immediate outbound contact.

#### D. Advanced Filtering & CSV Data Export
- Filter by admission status, selected engineering program, score tiers (Above 85%, 70%–85%, Below 70%), or faculty assignment ("Assigned to Me" vs "Unassigned").
- **One-Click UTF-8 CSV Export:** Clean export of applicant lists, contact details, academic percentages, and counselor notes for university admission records.

#### E. Super Admin Staff Access Delegation
- Super Admins can add and assign faculty members with specific roles directly through the dashboard UI.

---

## 4. Technical Architecture & System Design

```
+------------------------------------------------------------------------------------+
|                                FRONTEND ARCHITECTURE                               |
|                                                                                    |
|   +----------------------------------------------------------------------------+   |
|   |                         React 18 Single Page App                           |   |
|   |                                                                            |   |
|   |   +--------------------+  +----------------------+  +------------------+   |   |
|   |   |   Home Component   |  |   Compare Engine     |  | AI Inquiry Chat  |   |   |
|   |   +--------------------+  +----------------------+  +------------------+   |   |
|   |   +--------------------+  +----------------------+  +------------------+   |   |
|   |   | Dashboard (CRM)    |  | Staff Authentication |  | Inquiry Tracker  |   |   |
|   |   +--------------------+  +----------------------+  +------------------+   |   |
|   +----------------------------------------------------------------------------+   |
|                                         |                                          |
|                          Vite 5 Bundler & Vanilla Modern CSS                       |
+------------------------------------------------------------------------------------+
                                          |
                                   HTTPS / REST / WSS
                                          |
+------------------------------------------------------------------------------------+
|                             BACKEND-AS-A-SERVICE (Supabase)                        |
|                                                                                    |
|   +-----------------------+     +--------------------+     +-------------------+   |
|   |     Supabase Auth     |     |   PostgreSQL 15+   |     | Security Definer  |   |
|   |  (JWT & Session Mgt)  |     |   Database Engine  |     | Stored Procedures |   |
|   +-----------------------+     +--------------------+     +-------------------+   |
|                                         |                                          |
|            +-------------------------------------------------------+               |
|            |             Row Level Security (RLS) Engine           |               |
|            | - Public Can SELECT published programs & facts        |               |
|            | - Public CANNOT SELECT inquiries table                |               |
|            | - Staff (is_staff) Can SELECT & UPDATE inquiries      |               |
|            | - Super Admin (is_super_admin) Can Manage Staff/Progs |               |
|            +-------------------------------------------------------+               |
+------------------------------------------------------------------------------------+
```

### 4.1 Architecture Highlights
1. **Serverless Jamstack Model:**
   No expensive custom backend server to maintain. The React client communicates directly with managed PostgreSQL via Supabase client libraries, maximizing performance, reducing latency, and drastically lowering operational overhead.
2. **Fail-Closed Security Posture:**
   If a user visits `/staff` or inspects network queries, they cannot access raw leads unless authenticated with a verified role in `public.staff_profiles`. The database itself rejects all unauthorized queries at the PostgreSQL kernel level via Row Level Security (RLS).
3. **RPC Encapsulation for Public Writes:**
   Public inquiries are inserted via the `public.submit_inquiry(...)` `SECURITY DEFINER` function. The table `public.inquiries` has no public `SELECT` or `INSERT` policy, preventing automated scrapers from stealing applicant records.
4. **Resilient Local Fallback:**
   If Supabase environment keys are not configured or during cloud downtime, the portal gracefully falls back to verified static programs and fact constants, allowing the public brochure and UI to remain functional.

---

## 5. Technology Stack, Languages & Tools

### 5.1 Programming & Markup Languages
| Technology | Category | Purpose in Project |
| :--- | :--- | :--- |
| **JavaScript (ES Modules)** | Programming Language | Core client-side business logic, state machines, and interactions. |
| **JSX** | UI Syntax Extension | Declarative component structure combining HTML and JavaScript. |
| **HTML5** | Markup Language | Semantic document structure, SEO tags, responsive viewports, and fonts. |
| **CSS3 (Vanilla Modern)** | Styling Engine | Responsive layouts, CSS variables, glassmorphism, flexbox/grid, and micro-interactions. |
| **SQL (PL/pgSQL)** | Database Language | Schema migrations, Row Level Security policies, indexes, and stored procedures. |

### 5.2 Libraries & Frameworks
| Library / Package | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `18.x` | Declarative UI rendering, hooks (`useState`, `useEffect`, `useRef`), and component lifecycle. |
| **React DOM** | `18.x` | DOM rendering target for the React application. |
| **Vite** | `5.x` | High-performance developer tooling, lightning-fast HMR, and optimized production bundler. |
| **@vitejs/plugin-react** | Latest | Official Babel/React integration for Vite. |
| **Lucide React** | Latest | Modern, scalable feather-style SVG icon system for university interfaces. |
| **@supabase/supabase-js**| Latest | Official isomorphic client for Supabase authentication, queries, and stored procedures. |

### 5.3 Database & Cloud Infrastructure
| Infrastructure Layer | Platform / Tool | Details |
| :--- | :--- | :--- |
| **Relational Database** | PostgreSQL 15+ (Supabase) | ACID compliance, JSONB support, relational constraints, foreign keys, and indexes. |
| **Identity & Authentication** | Supabase Auth | Cryptographic password hashing, secure JWT tokens, and session persistence. |
| **Data Protection** | PostgreSQL Row Level Security (RLS) | Declarative access control rules enforced at the database row level. |
| **Hosting & Deployment** | Vercel | Global edge CDN, automated HTTPS, rewrite configurations for SPA routing (`vercel.json`). |
| **Typography** | Google Fonts | Web typography: `Albert Sans` (clean sans-serif) and `Oxanium` (futuristic tech accent). |

---

## 6. Complete Database Schema & Data Models

### 6.1 Database Tables

```
                    +------------------------+
                    |      auth.users        |
                    | (Supabase Auth Engine) |
                    +------------------------+
                                |
             +------------------+------------------+
             | 1:1                                 | 1:N
             v                                     v
+--------------------------+             +--------------------------+
|  public.staff_profiles   |             |     public.inquiries     |
+--------------------------+             +--------------------------+
| user_id (PK, FK)         |             | id (PK, UUID)            |
| email                    |             | reference_code (UNIQUE)  |
| role (super_admin/staff) |             | student_name             |
| display_name             |             | email, phone             |
| department               |             | program_interest         |
| created_by (FK)          |             | marks_10th, marks_12th   |
| created_at               |             | entrance_exam, score     |
+--------------------------+             | location, question       |
             |                           | status (new/contacted...) |
             |                           | counselor_notes          |
             +-------------------------->| assigned_to (FK)         |
                     assigned faculty    | created_at, updated_at   |
                                         +--------------------------+

+--------------------------+             +--------------------------+
|     public.programs      |             |  public.admission_facts  |
+--------------------------+             +--------------------------+
| id (PK, text)            |             | key (PK, text)           |
| name, degree, level      |             | value (text)             |
| duration                 |             | category                 |
| annual_tuition_fee       |             | source_url               |
| intake_seats             |             | verified_at              |
| description, eligibility |             | published (boolean)      |
| career_opportunities     |             +--------------------------+
| published, academic_year |
+--------------------------+
```

#### Table: `public.programs`
Stores the official academic program catalog for the university.
- `id` (`text`, Primary Key): Machine-readable identifier (e.g., `'btech-aiml'`).
- `name` (`text`): Full academic title.
- `degree` (`text`): Academic degree designation (`B.Tech`, `M.Tech`, `Diploma`).
- `level` (`text`): Degree level (`Undergraduate`, `Postgraduate`, `Diploma`).
- `duration` (`text`): Duration of study (e.g., `'4 years'`).
- `annual_tuition_fee` (`numeric(10,2)`): Approved annual tuition fee.
- `intake_seats` (`integer`): Official seat intake capacity.
- `description` (`text`): Comprehensive curriculum overview.
- `eligibility` (`text`): Compulsory subject requirements and minimum percentage cutoffs.
- `career_opportunities` (`text`): Core job roles and industrial career tracks.
- `published` (`boolean`): Toggle for public visibility.
- `source_url` (`text`): Verifiable citation link to university catalog.
- `academic_year` (`text`): Current batch tag (`2026–27`).

#### Table: `public.admission_facts`
Stores institutional facts, fees, deadlines, and contact information.
- `key` (`text`, Primary Key): Key identifier (e.g., `'application_deadline'`).
- `value` (`text`): Value or description.
- `category` (`text`): Categorization (`general`, `dates`, `fees`, `scholarships`, `contact`).
- `source_url` (`text`): Verification URL.
- `published` (`boolean`): Public availability toggle.

#### Table: `public.inquiries`
Stores student admissions inquiries and profile information.
- `id` (`uuid`, Primary Key): Auto-generated unique identifier.
- `reference_code` (`text`, Unique): Publicly trackable reference number (`IICT-2026-XXXX`).
- `student_name` (`text`): Candidate's full name.
- `email` (`text`): Contact email.
- `phone` (`text`): Contact phone number.
- `program_interest` (`text`): Selected academic program.
- `course_category` (`text`): Category (`UG`, `PG`, `Diploma`, `DSY`).
- `marks_10th` (`numeric(5,2)`): 10th standard percentage.
- `marks_12th` (`numeric(5,2)`): 12th standard (HSC / PCM) aggregate.
- `entrance_exam` (`text`): Name of qualifying exam (MGMU-CET, MHT-CET, JEE Main).
- `entrance_score` (`numeric(6,2)`): Exam score or percentile.
- `location` (`text`): Student's home district or state.
- `question` (`text`): Questions, transcript notes, or specific requests.
- `consent_to_contact` (`boolean`): Digital communication consent.
- `status` (`text`): Lifecycle stage (`new`, `contacted`, `qualified`, `closed`).
- `counselor_notes` (`text`): Internal remarks entered by faculty.
- `assigned_to` (`uuid`, Foreign Key to `auth.users`): Assigned counselor/faculty ID.
- `created_at` / `updated_at` (`timestamptz`): Timestamps.

#### Table: `public.staff_profiles`
Maintains internal staff roles and access levels.
- `user_id` (`uuid`, Primary Key, Foreign Key to `auth.users.id`): Authentication link.
- `email` (`text`): Registered staff email address.
- `role` (`text`): System role (`super_admin`, `teacher`, `counsellor`, `manager`, `admin`).
- `display_name` (`text`): Name shown on dashboards and assignments.
- `department` (`text`): Institutional unit (e.g., `'IICT Faculty'`).
- `created_by` (`uuid`): Super Admin who authorized the account.
- `created_at` (`timestamptz`): Authorization timestamp.

---

### 6.2 Stored Procedures & Database Functions
1. `public.is_staff()` (`RETURNS boolean`): Evaluates whether `auth.uid()` exists in `staff_profiles`.
2. `public.is_super_admin()` (`RETURNS boolean`): Evaluates whether `auth.uid()` has role `'super_admin'`.
3. `public.submit_inquiry(...)` (`RETURNS text`): Validates and inserts applicant records atomically; returns the new reference code.
4. `public.get_my_inquiry_status(p_reference_code text)` (`RETURNS json`): Securely queries and returns applicant reference status for the public tracker without exposing sensitive data.
5. `public.grant_teacher_access(...)` (`RETURNS text`): Super-admin-only function to assign staff roles.

---

## 7. Security, Privacy & Data Integrity

- **Zero-Trust RLS Policies:**
  - The `inquiries` table has no public `SELECT` or `INSERT` permissions. Only authenticated staff with verified roles can view or modify leads.
- **Fail-Closed Role Guards:**
  - If a staff member is authenticated via Supabase Auth but not listed in `public.staff_profiles`, access to lead records is immediately denied.
- **Public Query Isolation:**
  - The public tracker function `get_my_inquiry_status` returns only non-sensitive status information, preventing brute-force data harvesting.
- **SQL Injection Defense:**
  - All database interactions use parameterized PostgreSQL queries and stored procedures, preventing SQL injection vulnerabilities.

---

## 8. Areas for Improvement (Codebase Analysis)

While the application is functional and secure, the following structural improvements will enhance code maintainability and scalability:

### 8.1 Component Architecture Modularization
- **Current State:** `src/main.jsx` is currently a monolithic file with **~3,974 lines of code** containing all sub-components (`Home`, `Compare`, `Inquiry`, `Dashboard`, `StaffLogin`, `MyInquiryModal`).
- **Recommended Refactoring:** Break down `main.jsx` into a standard modular architecture:
  ```
  src/
  ├── components/
  │   ├── common/         (Header.jsx, Footer.jsx, Logo.jsx)
  │   ├── compare/        (CompareTable.jsx, ProgramCard.jsx, FilterBar.jsx)
  │   ├── inquiry/        (ChatBot.jsx, ProfileSummary.jsx, TrackerModal.jsx)
  │   └── dashboard/      (KpiCards.jsx, LeadsTable.jsx, WhatsAppModal.jsx, StaffAdmin.jsx)
  ├── hooks/              (usePrograms.js, useInquiries.js, useAuth.js)
  ├── context/            (AuthContext.jsx)
  ├── lib/                (supabase.js, formatters.js, constants.js)
  └── main.jsx            (Root router and entry point)
  ```

### 8.2 State Management & Client-Side Routing
- **Current State:** State is managed via local `useState` lifted to the root component, and routing uses custom browser history wrappers.
- **Recommended Upgrade:**
  - Integrate **React Router v6** (`createBrowserRouter`) for deep-linking (e.g., `/compare`, `/inquiry`, `/dashboard`, `/track/:refCode`).
  - Introduce **Zustand** or **TanStack Query (React Query)** to handle caching, background data refetching, and state deduplication.

### 8.3 TypeScript Migration
- **Current State:** Plain JavaScript with dynamic typing.
- **Recommended Upgrade:** Migrate to **TypeScript** (`.tsx`) with auto-generated Supabase database types (`supabase gen types typescript`) to provide complete type safety across all database queries.

### 8.4 Automated Testing
- **Current State:** Manual testing.
- **Recommended Upgrade:** Implement a testing suite:
  - **Vitest & React Testing Library** for component unit tests (e.g., fee formatting, filter accuracy).
  - **Playwright** for end-to-end testing of the full student inquiry and staff login workflows.

---

## 9. Future Upgrades & Strategic Roadmap

Here are the highest-impact future enhancements planned for the platform:

```
+------------------------------------------------------------------------------------+
|                         FUTURE UPGRADES & PRODUCT ROADMAP                          |
+------------------------------------------------------------------------------------+
       |
       +---> [Phase 1: Communication Automation]
       |     • Official WhatsApp Cloud API (Automated Chatbot & Status Updates)
       |     • Twilio / Fast2SMS OTP verification for candidate mobile numbers
       |     • Automated transactional confirmation emails via Resend / SendGrid
       |
       +---> [Phase 2: Online Payments & Seat Booking]
       |     • Razorpay / PayU / Easebuzz Payment Gateway integration
       |     • Instant online collection of the ₹2,000 application / MGMU-CET fee
       |     • Digital receipt generation and downloadable provisional admission slips
       |
       +---> [Phase 3: AI Document Processing & Verification]
       |     • OCR Scorecard Scanner (Auto-extract 10th/12th marks from marksheets)
       |     • Automated eligibility validation against Maharashtra CET cell rules
       |     • Cloudinary / Supabase Storage integration for document archiving
       |
       +---> [Phase 4: Multilingual & Accessibility Support]
       |     • Full Marathi (मराठी) and Hindi (हिंदी) localization
       |     • Multilingual AI counselling for rural and regional aspirants
       |     • Voice-based AI counsellor interface using Web Speech API
       |
       +---> [Phase 5: Institutional Intelligence & Predictive Analytics]
       |     • Machine Learning lead scoring (predicting enrollment probability)
       |     • Conversion funnel metrics (traffic -> inquiry -> qualified -> enrolled)
       |     • Counselor performance benchmarking & response-time tracking
```

---

## 10. Summary & Impact Assessment

| Dimension | Previous Status | With IICT Admissions Portal |
| :--- | :--- | :--- |
| **Information Delivery** | Static, dense PDFs and fragmented notices | Interactive, searchable program matrix with transparent fee structures |
| **Student Inquiries** | Unsecured generic forms or paper inquiries | Conversational AI guidance with instant reference code generation |
| **Data Security & Privacy**| Exposed spreadsheets vulnerable to data leaks | Zero-Trust PostgreSQL Row-Level Security (RLS) with role separation |
| **Counselor Productivity**| Manual calls without structured context | Centralized CRM with status pipelines, counselor notes, and WhatsApp templates |
| **Scalability** | Server-dependent, prone to traffic crashes | Serverless Jamstack on global edge CDN with high concurrency capacity |

---

*Document compiled for MGM University, Institute of Information and Communication Technology (IICT).*  
*Academic Cycle: 2026–27 | Chhatrapati Sambhajinagar (Aurangabad), Maharashtra.*

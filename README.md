# IICT Admissions

Supabase-first MGM University IICT admissions experience with:

- public counselling entry point and inquiry submission
- side-by-side program comparison for up to four pathways
- verified MGM University facts with IICT-specific unknowns clearly marked
- fail-closed `/staff` login through Supabase Auth and staff-only inquiry reads through RLS
- no custom API server required for the core workflow

## Run locally

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` and add the Supabase project URL and anon key. Then apply [supabase/migrations/001_iict_admissions.sql](C:\Users\Umesh\Documents\New project\supabase\migrations\001_iict_admissions.sql) in the Supabase SQL editor.

Create staff users in Supabase Auth, then insert their user IDs into `public.staff_profiles`.

The app keeps public comparison content available locally, but real inquiry submission and staff access stay disabled until Supabase is configured.

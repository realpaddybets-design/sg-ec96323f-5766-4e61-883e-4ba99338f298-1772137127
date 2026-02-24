# Technical Architecture

## 1. Tech Stack
- **Frontend:** Next.js 15 (Pages Router), React 18, TypeScript.
- **Styling:** Tailwind CSS, Lucide React (Icons), Shadcn/UI (Components).
- **Backend:** Supabase (PostgreSQL Database, Auth, Storage, Realtime).
- **Forms:** React Hook Form + Zod validation.
- **Payments:** Stripe (Client-side integration for donation links/elements).

## 2. Database Schema (Supabase)

### `profiles` (Public profile table, linked to auth.users)
- `id`: uuid (PK, refs auth.users)
- `email`: text
- `role`: text ('staff', 'admin')
- `created_at`: timestamp

### `applications`
- `id`: uuid (PK)
- `created_at`: timestamp
- `status`: text ('pending', 'approved', 'denied', 'info_requested') - Default: 'pending'
- `type`: text ('fun_grant', 'angel_aid', 'angel_hug', 'scholarship', 'ukraine')
- `applicant_name`: text
- `applicant_email`: text
- `applicant_phone`: text
- `details`: text (The story or request details)
- `amount_requested`: numeric (optional)
- `attachments`: array (text URLs from Supabase Storage)

### `application_votes`
- `id`: uuid (PK)
- `application_id`: uuid (FK applications.id)
- `user_id`: uuid (FK profiles.id)
- `vote`: text ('approve', 'deny', 'request_info')
- `notes`: text
- `created_at`: timestamp

### `application_notes` (Internal comments)
- `id`: uuid (PK)
- `application_id`: uuid (FK applications.id)
- `user_id`: uuid (FK profiles.id)
- `content`: text
- `created_at`: timestamp

## 3. Security (RLS Policies)
- **Applications Table:**
  - `INSERT`: Public (anon key) allowed.
  - `SELECT`: Only authenticated users with role 'staff' or 'admin'.
  - `UPDATE`: Only authenticated users with role 'staff' or 'admin'.
- **Votes/Notes Tables:**
  - `ALL`: Only authenticated users with role 'staff' or 'admin'.

## 4. Project Structure
```
src/
  components/
    layout/       # Navbar, Footer, Layout wrapper
    ui/           # Shadcn components (Button, Card, Input...)
    forms/        # GrantApplicationForm, DonationForm
    admin/        # Dashboard tables, Voting controls
  pages/
    index.tsx     # Home
    about.tsx     # Who We Are
    programs.tsx  # What We Do / Programs
    apply/        # Application routes
      index.tsx
      [type].tsx  # Dynamic form for specific grant types
    donate.tsx
    podcast.tsx
    events.tsx
    admin/        # Protected Routes
      login.tsx
      dashboard.tsx
      applications/
        [id].tsx  # Application Detail View
  lib/
    supabaseClient.ts
    types.ts      # TypeScript interfaces
  styles/
    globals.css
```

## 5. Integration Points
- **Supabase Auth:** Handles login sessions.
- **Supabase Database:** Stores all data.
- **Stripe:** Use `react-stripe-js` or direct payment links for the initial MVP to reduce PCI compliance complexity.
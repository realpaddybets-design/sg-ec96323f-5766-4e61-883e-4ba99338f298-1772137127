# Technical Architecture

## 1. Tech Stack
- **Frontend:** Next.js 15 (Pages Router), React 18, TypeScript.
- **Styling:** Tailwind CSS, Lucide React (Icons), Shadcn/UI (Components).
- **Backend:** Supabase (PostgreSQL Database, Auth, Storage, Realtime).
- **Forms:** React Hook Form + Zod validation.
- **Payments:** Stripe (Client-side integration).

## 2. Database Schema (Supabase)

### `profiles` (Public profile table, linked to auth.users)
- `id`: uuid (PK, refs auth.users)
- `email`: text
- `role`: text ('staff', 'admin')
- `full_name`: text

### `staff_assignments` (NEW)
- `id`: uuid (PK)
- `user_id`: uuid (FK profiles.id)
- `school_name`: text (Matches the dropdown values)
- *Note: Multiple staff can be assigned to the same school.*

### `applications`
- `id`: uuid (PK)
- `type`: text ('fun_grant', 'angel_aid', 'angel_hug', 'scholarship', 'ukraine')
- `school`: text (Only for scholarships - nullable)
- `status`: text ('submitted', 'under_review', 'recommended', 'board_approved', 'denied', 'more_info')
- `recommendation_summary`: text (Filled by staff when moving to 'recommended')
- `applicant_name`, `email`, `phone`, `details`, `attachments`: standard fields.

### `application_votes`
- `id`: uuid (PK)
- `application_id`: uuid
- `user_id`: uuid
- `vote`: text ('approve', 'deny')

## 3. Security (RLS Policies) - Critical

### Staff Access Control
- **General Grants:** Visible to all staff.
- **Scholarships:**
  - `SELECT`: Auth user can see IF:
    1. They are 'admin' OR
    2. `application.school` exists in `staff_assignments` for their `user_id` OR
    3. `application.status` is 'recommended' (Visible to board for voting).

## 4. Project Structure
```
src/
  components/
    forms/
      ScholarshipForm.tsx  # Includes the School Dropdown
    admin/
      SchoolAssignmentManager.tsx # Admin tool to link Staff <-> Schools
  pages/
    scholarships.tsx       # Public landing & form
    admin/
      dashboard.tsx        # Main dashboard
      assignments.tsx      # School assignment management
      board-review.tsx     # "Pending Approval" page for Board
```

## 5. Integration Points
- **Supabase Auth:** Staff login.
- **Supabase Database:** Core logic.
- **Stripe:** Donations.
# Implementation Plan

## Phase 1: Project Setup & Core UI (Complete)
- [x] Basic navigation and layout.
- [x] Global styles.

## Phase 2: Public Content Pages
- [ ] **Home Page:** Hero section, Mission, CTA.
- [ ] **Who We Are / What We Do:** Static content pages.
- [ ] **Donate Page:** Stripe integration.
- [ ] **Scholarship Page:** Public info + Application Form with School Dropdown.

## Phase 3: Database & Auth (Supabase)
- [ ] **Schema Setup:** Run updated SQL for tables (`applications`, `staff_assignments`).
- [ ] **Auth:** Configure Supabase Auth and RLS policies.
- [ ] **Storage:** Bucket for PDF uploads (transcripts).

## Phase 4: Scholarship Workflow (Backend)
- [ ] **School Assignment Tool:** UI for Admins to map Staff -> Schools.
- [ ] **Staff Dashboard:**
  - Logic: Fetch `my_assignments`.
  - Filter: Show applications matching my schools.
  - Action: "Recommend Finalist" button -> Opens modal for Summary -> Updates status to 'recommended'.
- [ ] **Board Review Page:**
  - Filter: Show all applications with status 'recommended'.
  - Action: Vote/Approve.

## Phase 5: General Application System
- [ ] Generic forms for Fun Grants/Angel Aid.
- [ ] Email notifications (Resend/SendGrid).

## Phase 6: Polish & Launch
- [ ] SEO, Mobile Testing, Accessibility.
# Implementation Plan

## Phase 1: Project Setup & Core UI
- [ ] Initialize global styles (colors, typography) matching Kelly's Angels brand.
- [ ] Create `Layout`, `Navbar`, and `Footer` components.
- [ ] Implement responsive navigation structure.
- [ ] **Deliverable:** Basic shell of the website is navigable.

## Phase 2: Public Content Pages
- [ ] **Home Page:** Hero section, Mission, CTA.
- [ ] **Who We Are:** Founder story and history.
- [ ] **Programs Hub:** Sections for all grant types with "Apply" buttons.
- [ ] **Events & Podcast:** Info pages for 5K and Podcast.
- [ ] **Donate Page:** Stripe integration (or placeholder UI until keys provided).
- [ ] **Deliverable:** All static informational pages complete.

## Phase 3: Backend & Database (Supabase)
- [ ] **User Action Required:** Connect Supabase project.
- [ ] Create `profiles`, `applications`, `application_votes` tables.
- [ ] Set up Row Level Security (RLS) policies.
- [ ] Configure Storage bucket for application attachments (if needed).
- [ ] **Deliverable:** Database ready to accept data.

## Phase 4: Application System
- [ ] Create generic `ApplicationForm` component using React Hook Form + Zod.
- [ ] Implement file upload logic (if storage enabled).
- [ ] Create public route `/apply/[type]` to handle submissions.
- [ ] Connect form submission to Supabase `applications` table.
- [ ] **Deliverable:** Public users can submit grant applications.

## Phase 5: Staff Dashboard & Auth
- [ ] Create `/admin/login` page with Supabase Auth.
- [ ] Create Protected Route wrapper (redirect if not logged in).
- [ ] Build `/admin/dashboard`:
  - Fetch and display list of applications.
  - Implement filtering (Pending vs. Processed).
- [ ] Build `/admin/applications/[id]`:
  - Detailed view of application.
  - Voting UI (Approve/Deny).
  - Internal notes section.
- [ ] **Deliverable:** Functional staff portal for managing applications.

## Phase 6: Polish & Launch Prep
- [ ] Add SEO meta tags to all pages.
- [ ] Test responsive design on mobile/tablet.
- [ ] Verify accessibility (alt text, contrast).
- [ ] Final code cleanup and documentation.
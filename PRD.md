# Product Requirements Document (PRD) - Kelly's Angels Inc. Website Rebuild

## 1. Project Overview
**Goal:** Rebuild kellysangelsinc.org to modernize the design, improve navigation, and add a secure backend for grant/scholarship management.
**Target Audience:** Families in need, donors, volunteers, event participants, scholarship applicants.
**Tech Stack:** Next.js 15, Tailwind CSS, Supabase (Auth, DB, Storage).

## 2. User Roles
- **Guest:** View public content, submit applications (no login), donate.
- **Staff:** Log in, view assigned scholarship applications, view/vote on grant applications.
- **Admin:** Manage users, assign schools to staff, override votes, view analytics.

## 3. Site Structure & Features

### Navigation (Global)
- **Style:** Clean horizontal link bar (no logo/brand name in nav, handled by Hero).
- **Links:** Home, About, What We Do, Programs, Podcast, Events, Scholarships.
- **CTA:** "Donate" button (Pink).

### Pages

#### 1. Home (`/`)
- **Hero:** Large logo, mission statement ("Helping children and their families smile..."), "Apply for a Grant" & "Make a Donation" buttons.
- **Content:** Highlights of programs, latest news/events.

#### 2. Who We Are (`/who-we-are`)
- **Story:** Mark Mulholland's founding story, Kelly's legacy.
- **Team:** Board members/volunteers list.

#### 3. What We Do (`/what-we-do`)
- **Overview:** Explanation of the mission and impact.

#### 4. Programs / Applications (`/programs`)
- **Unified Hub:** Fun Grants, Angel Aid, Angel Hugs.
- **Forms:** Secure submission forms (Name, Email, Story, File Uploads).
- **Backend:** Data saved to `applications` table.

#### 5. Scholarships (`/scholarships`)
- **Description:** For college-bound seniors who have overcome adversity.
- **Form:** Integrated application.
- **School Dropdown (Required):**
    1. Ft. Edward High School
    2. Lake George High School
    3. Mechanicville High School
    4. Glens Falls High School
    5. Hoosic Valley High School
    6. Queensbury High School
    7. Saratoga Central Catholic School
    8. Saratoga Springs High School
    9. Shenendehowa High School
    10. South Glens Falls High School
    11. Stillwater High School
    12. Ravena-Coeymans-Selkirk
    13. Hudson Falls
    14. Whitehall High School
- **Workflow:**
    - Staff Pair assigned to specific schools.
    - Staff reviews applicants from their schools -> Selects "Top 2" -> Writes Summary.
    - "Recommended" applicants move to Board Review page.

#### 6. Podcast (`/podcast`)
- **The Up Beat:** Links to episodes, descriptions.

#### 7. Events (`/events`)
- **Mother-Lovin' 5K:** Details, registration link.
- **Upcoming Events:** Calendar or list.

#### 8. Donate (`/donate`)
- **Integration:** Stripe (replace PayPal).
- **Options:** One-time, Recurring, Custom Amount.

#### 9. Hugs for Ukraine (`/hugs-for-ukraine`)
- **Content:** Specific initiative details.

### Staff Dashboard (Private - `/staff/dashboard`)
- **Login:** Email/Password via Supabase Auth.
- **Views:**
    - **My Assignments:** Scholarship applications from assigned schools.
    - **Grant Applications:** Fun Grants/Angel Aid for review.
    - **Pending Approval:** Board view of "Recommended" scholarship finalists.
- **Actions:** Vote (Approve/Deny/Request Info), Add Notes, Download Attachments.

## 4. Technical Requirements
- **Database:** Supabase Postgres.
- **Tables:** `applications`, `profiles` (staff), `votes`, `school_assignments`.
- **Security:** RLS (Row Level Security) - Staff see only assigned schools or all if Admin.
- **Storage:** Supabase Storage for application attachments (secure buckets).
- **Email:** Transactional emails for new submissions (Resend/SendGrid).

## 5. Design Guidelines
- **Tone:** Compassionate, bright, hopeful ("bringing smiles").
- **Colors:** Brand Pink, White, Soft Gray.
- **Typography:** Clean sans-serif, readable.
- **Responsive:** Mobile-first approach.
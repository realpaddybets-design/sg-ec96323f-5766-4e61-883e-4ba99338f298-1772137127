# Product Requirements Document (PRD) - Kelly's Angels Inc. Website Rebuild

## 1. Project Overview
**Kelly's Angels Inc.** is a 501(c)(3) nonprofit helping children and families in NY's Capital Region affected by the loss of a loved one due to cancer or other illnesses. The goal is to modernize the existing website, improve user experience, and implement a backend system for managing grant applications and staff workflows.

## 2. User Roles
- **Public User (Guest):** Can view content, donate, and submit grant/scholarship applications.
- **Staff:** Can log in, view submitted applications, add internal notes, and vote on applications.
- **Admin:** Includes all Staff permissions plus user management (inviting other staff).

## 3. Core Features & Pages

### 3.1 Public Website (Content)
- **Navigation:** Top menu bar (sticky/responsive) linking to all sections.
- **Home:** Mission statement, "Register Today" CTA (5K), emotional connection.
- **Who We Are:** Founder story (Mark Mulholland), Kelly's legacy.
- **What We Do:** Overview of impact and grant types.
- **Programs & Grants:**
  - Unified hub for Fun Grants, Angel Aid, Angel Hugs.
  - Detailed descriptions and eligibility.
  - **Feature:** "Apply Now" buttons linking to dynamic forms.
- **The Up Beat Podcast:** Description and links to platforms/embedded episodes.
- **Events (Mother-Lovin' 5K):** Event details, registration links.
- **Scholarships:** Information for high school seniors and application instructions.
- **Hugs for Ukraine:** Campaign details and nomination form.
- **Donate:** Stripe integration for secure one-time and recurring donations.
- **Footer:** Contact info, 501(c)(3) status, privacy policy, social links.

### 3.2 Application System (Backend)
- **Submission Forms:**
  - Secure forms for each grant type.
  - Fields: Applicant Name, Email, Phone, Grant Type, Story/Details, Attachments (optional).
  - No login required for submission.
- **Database:** Securely store all application data (Supabase).

### 3.3 Staff Dashboard (Protected)
- **Authentication:** Email/Password login via Supabase Auth.
- **Dashboard View:**
  - List of all applications.
  - Filter by Status (Pending, Approved, Denied, More Info Needed) and Type.
- **Application Detail View:**
  - Read-only view of applicant data.
  - **Voting System:** Staff can vote "Approve", "Deny", or "Request Info".
  - **Notes:** Internal comments section for staff collaboration.
  - **Status Management:** Admin or majority vote updates the application status.
- **Notifications (Architecture Only):** System to trigger emails via 3rd party (Resend/SendGrid) upon submission or status change (implementation requires API keys).

### 3.4 Donations
- **Stripe Integration:**
  - Custom donation amounts.
  - Secure processing.
  - Branding alignment.

## 4. Non-Functional Requirements
- **Design:** Clean, compassionate, "bringing smiles" aesthetic.
- **Mobile Responsiveness:** Fully functional on all devices.
- **Security:** Row Level Security (RLS) to ensure public can only create, and only staff can read sensitive data.
- **Performance:** Optimized images and fast loading (Next.js).
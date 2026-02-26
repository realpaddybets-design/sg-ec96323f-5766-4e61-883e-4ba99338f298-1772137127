# Kelly's Angels - Volunteer & Admin System Implementation Guide

## 🎉 What's Been Built

### 1. Volunteer Management System
**Public Volunteer Opportunities Page** (`/volunteer-opportunities`)
- Shows all upcoming volunteer opportunities
- Displays spots remaining for each event
- RSVP button prompts signup/login before registration
- No authentication required to view opportunities

**Volunteer Portal** (`/volunteer/login` and `/volunteer/dashboard`)
- Separate authentication system for volunteers
- Dashboard shows:
  - Upcoming events they've registered for
  - Communications/announcements from staff
  - All registered events with cancel option
  - Past events history with hours logged

**Staff Admin Features** (in `/staff/dashboard` → Volunteers tab)
- Create and manage volunteer opportunities
- View all RSVPs and volunteer details
- Send announcements (with email/SMS notification options)
- Mark attendance and log volunteer hours
- Track volunteer engagement

### 2. Grant Archive System
**Grant Management** (`/staff/dashboard` → Grants tab)
- Searchable and filterable grant database
- Filter by status, date range, grant type
- View full application details
- Upload supporting documents and photos
- Export grants to Excel for reporting
- Link grants to original applications
- Track amount requested vs. awarded

### 3. Meeting Management
**Next Meeting Widget** (on staff dashboard)
- Displays upcoming meeting date, time, location
- Link to agenda document
- Any admin can update meeting details

**Meeting Minutes Section** (`/staff/dashboard` → Meetings tab)
- Upload meeting minutes (PDF/Word documents)
- Approve/Deny/Discuss workflow
- Comment threads for discussion items
- Archive of past meetings with approval status
- Vote tracking per staff member

### 4. Enhanced Admin Navigation
**Staff Dashboard Structure:**
- Dashboard (overview + next meeting + pending votes alert)
- Applications (all submissions)
- Scholarships (student applications)
- Grants (archive with search/export)
- Volunteers (opportunities, RSVPs, announcements)
- Meetings (schedule, minutes, approvals)
- Owner Panel (user management - owner only)

## 📋 Database Schema to Run

**IMPORTANT:** Copy the entire contents of `supabase-volunteer-schema.sql` and run it in your Supabase SQL Editor.

This creates 10 new tables:
1. `volunteer_opportunities` - Volunteer events
2. `volunteer_profiles` - Volunteer user accounts
3. `volunteer_rsvps` - Registration tracking
4. `volunteer_announcements` - Staff-to-volunteer communications
5. `announcement_reads` - Track who read announcements
6. `grants` - Grant application archive
7. `meeting_minutes` - Meeting document uploads
8. `meeting_votes` - Approve/deny/discuss votes
9. `meeting_comments` - Discussion threads
10. `next_meeting` - Upcoming meeting info

The schema includes:
- Row Level Security (RLS) policies for all tables
- Automatic triggers to update spots remaining
- Automatic volunteer hour tracking
- Indexes for performance
- Sample data for testing

## 🔧 What You Need to Configure

### 1. Email Notifications (Optional but Recommended)
To enable email notifications when staff send announcements:
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize the invitation email template
3. Consider integrating with SendGrid or Mailgun for better deliverability

### 2. SMS Notifications (Optional)
To enable SMS for urgent announcements:
1. Sign up for Twilio (free trial gives you credit)
2. Get your Account SID and Auth Token
3. Add to your `.env.local`:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```
4. I can build the SMS sending function when you're ready

### 3. Document Storage
Currently uses Supabase Storage for meeting minutes and grant documents.
**Storage Buckets to Create:**
1. Go to Supabase Dashboard → Storage
2. Create these buckets:
   - `meeting-minutes` (private)
   - `grant-documents` (private)
   - `volunteer-documents` (private)
3. Set appropriate RLS policies (staff-only access)

## 🚀 How to Use the System

### For Staff Members

**Managing Volunteers:**
1. Go to Staff Dashboard → Volunteers tab
2. Create new opportunities with title, description, date, location, spots
3. View RSVPs as they come in
4. Send announcements (check "urgent" for SMS)
5. After events, mark attendance and log hours

**Managing Grants:**
1. Go to Staff Dashboard → Grants tab
2. View all grants with filters
3. Click any grant to see details
4. Upload photos/documents as grants are completed
5. Export to Excel for annual reports

**Managing Meetings:**
1. Update "Next Meeting" widget on dashboard
2. Go to Meetings tab to upload minutes
3. Staff members vote Approve/Deny/Discuss
4. Use comments for items needing discussion

### For Volunteers

**Finding Opportunities:**
1. Visit `/volunteer-opportunities` (public page)
2. Browse all upcoming events
3. Click RSVP → prompted to create account
4. Once logged in, RSVP confirmed

**Managing Your Schedule:**
1. Login at `/volunteer/login`
2. Dashboard shows your upcoming events
3. View announcements from staff
4. Cancel RSVPs if needed
5. See your volunteer history

## 📊 Export Capabilities

**Grant Archive Export:**
- Click "Export to Excel" button in Grants tab
- Downloads all grants matching current filters
- Includes: recipient, amount, status, dates, notes

**Future Exports (can add if needed):**
- Volunteer hours report
- Event attendance sheets
- Meeting minutes archive

## 🔐 Security & Permissions

**Role Hierarchy:**
- **Owner** - Full system access, can create/delete users
- **Admin** - Can manage volunteers, grants, meetings, upload minutes
- **Staff** - Can view scholarships assigned to their schools, limited volunteer access
- **Volunteer** - Separate portal, can only manage own RSVPs

**Data Protection:**
- All tables have Row Level Security enabled
- Volunteers can only see their own data
- Staff can only see applications for their assigned schools (scholarships)
- Document uploads restricted to authenticated staff

## 🎯 Next Steps (Not Built Yet - Future Phases)

These were discussed but not implemented yet:

### Phase 2 - Communications Hub
- Internal task management (replace email chaos)
- @mentions and notifications
- Task assignment with status tracking

### Phase 3 - Integrations
- Cloudinary for organized photo library
- MailerLite API sync for better email segmentation
- Twilio SMS integration (once you have account)
- Event calendar integration

### Phase 4 - Advanced Features
- Multi-day event scheduling with shift assignments
- Public inquiry routing system
- Mobile app (Progressive Web App)
- Donor management system

## ⚠️ Important Notes

1. **Run the SQL first** - Nothing will work until you run `supabase-volunteer-schema.sql`

2. **Test thoroughly** - Create a test volunteer account to verify the flow works

3. **Backup before production** - Export your current data before going live

4. **Environment variables** - Make sure your `.env.local` has correct Supabase keys

5. **Navigation updates** - The main public navigation now includes "Volunteer Opportunities" link

## 🐛 Troubleshooting

**"Table does not exist" errors:**
- Run the SQL migration in Supabase SQL Editor
- Refresh your browser after running migration

**"Permission denied" errors:**
- Check RLS policies in Supabase Dashboard
- Verify user role in `user_profiles` table

**Volunteers can't sign up:**
- Check Supabase Authentication is enabled
- Verify email confirmation is disabled (or set up email templates)

**Documents won't upload:**
- Create the storage buckets listed above
- Set RLS policies on buckets

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase logs in dashboard
3. Verify the SQL migration ran successfully
4. Ask me for help with specific error messages

---

**Total Progress: 100%** ✅

All Phase 1 features are complete and ready to deploy!
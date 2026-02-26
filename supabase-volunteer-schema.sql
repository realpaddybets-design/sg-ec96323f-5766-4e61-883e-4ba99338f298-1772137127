-- ============================================================================
-- KELLY'S ANGELS VOLUNTEER & ADMIN SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Run this entire file in your Supabase SQL Editor
-- This creates all tables for volunteers, grants, meetings, and announcements
-- ============================================================================

-- 1. VOLUNTEER OPPORTUNITIES TABLE
-- Stores all volunteer opportunities that appear on public-facing page
CREATE TABLE IF NOT EXISTS volunteer_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  total_spots INTEGER NOT NULL CHECK (total_spots > 0),
  spots_remaining INTEGER NOT NULL CHECK (spots_remaining >= 0),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. VOLUNTEER PROFILES TABLE
-- Stores volunteer user profiles (separate from staff users)
CREATE TABLE IF NOT EXISTS volunteer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  total_hours DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. VOLUNTEER RSVPS TABLE
-- Tracks volunteer registrations for opportunities
CREATE TABLE IF NOT EXISTS volunteer_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES volunteer_opportunities(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended', 'no_show')),
  hours_worked DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(opportunity_id, volunteer_id)
);

-- 4. VOLUNTEER ANNOUNCEMENTS TABLE
-- Staff-to-volunteer communications
CREATE TABLE IF NOT EXISTS volunteer_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT false,
  send_email BOOLEAN DEFAULT true,
  send_sms BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. ANNOUNCEMENT READS TABLE
-- Tracks which volunteers have read announcements
CREATE TABLE IF NOT EXISTS announcement_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES volunteer_announcements(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(announcement_id, volunteer_id)
);

-- 6. GRANTS TABLE
-- Archive of all grant applications (non-scholarship)
CREATE TABLE IF NOT EXISTS grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  recipient_name TEXT NOT NULL,
  grant_type TEXT NOT NULL,
  amount_requested DECIMAL(10,2),
  amount_awarded DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'completed')),
  purpose TEXT,
  date_awarded DATE,
  date_completed DATE,
  notes TEXT,
  photo_url TEXT,
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. MEETING MINUTES TABLE
-- Stores uploaded meeting minutes and approval workflow
CREATE TABLE IF NOT EXISTS meeting_minutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_date DATE NOT NULL,
  document_url TEXT NOT NULL,
  summary TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'discussion')),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. MEETING VOTES TABLE
-- Tracks approve/deny/discuss votes on meeting minutes
CREATE TABLE IF NOT EXISTS meeting_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meeting_minutes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'deny', 'discuss')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(meeting_id, user_id)
);

-- 9. MEETING COMMENTS TABLE
-- Discussion threads on meeting minutes
CREATE TABLE IF NOT EXISTS meeting_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meeting_minutes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. NEXT MEETING TABLE
-- Stores info about upcoming meeting (only one active row)
CREATE TABLE IF NOT EXISTS next_meeting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  agenda_url TEXT,
  notes TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_volunteer_rsvps_opportunity ON volunteer_rsvps(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_rsvps_volunteer ON volunteer_rsvps(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_rsvps_status ON volunteer_rsvps(status);
CREATE INDEX IF NOT EXISTS idx_grants_status ON grants(status);
CREATE INDEX IF NOT EXISTS idx_grants_date_awarded ON grants(date_awarded);
CREATE INDEX IF NOT EXISTS idx_meeting_minutes_status ON meeting_minutes(status);
CREATE INDEX IF NOT EXISTS idx_meeting_votes_meeting ON meeting_votes(meeting_id);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_volunteer ON announcement_reads(volunteer_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_meeting ENABLE ROW LEVEL SECURITY;

-- Volunteer Opportunities: Public read, staff write
CREATE POLICY "Anyone can view active opportunities" ON volunteer_opportunities
  FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can manage opportunities" ON volunteer_opportunities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

-- Volunteer Profiles: Users can read/update their own
CREATE POLICY "Volunteers can view own profile" ON volunteer_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Volunteers can update own profile" ON volunteer_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Staff can view all volunteer profiles" ON volunteer_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

-- Volunteer RSVPs: Volunteers manage their own, staff see all
CREATE POLICY "Volunteers can manage own RSVPs" ON volunteer_rsvps
  FOR ALL USING (auth.uid() = volunteer_id);

CREATE POLICY "Staff can view all RSVPs" ON volunteer_rsvps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Staff can update RSVPs" ON volunteer_rsvps
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

-- Announcements: Volunteers read, staff write
CREATE POLICY "Volunteers can view announcements" ON volunteer_announcements
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM volunteer_profiles WHERE volunteer_profiles.id = auth.uid())
  );

CREATE POLICY "Staff can manage announcements" ON volunteer_announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

-- Announcement Reads: Volunteers track their own reads
CREATE POLICY "Volunteers can manage own reads" ON announcement_reads
  FOR ALL USING (auth.uid() = volunteer_id);

-- Grants: Staff only
CREATE POLICY "Staff can manage grants" ON grants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

-- Meeting Minutes: Staff only
CREATE POLICY "Staff can manage meeting minutes" ON meeting_minutes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Staff can vote on minutes" ON meeting_votes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Staff can comment on minutes" ON meeting_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

-- Next Meeting: Staff only
CREATE POLICY "Staff can manage next meeting" ON next_meeting
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to update spots_remaining when RSVP is created/cancelled
CREATE OR REPLACE FUNCTION update_opportunity_spots()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE volunteer_opportunities 
    SET spots_remaining = spots_remaining - 1
    WHERE id = NEW.opportunity_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
    UPDATE volunteer_opportunities 
    SET spots_remaining = spots_remaining + 1
    WHERE id = NEW.opportunity_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'cancelled' AND NEW.status = 'confirmed' THEN
    UPDATE volunteer_opportunities 
    SET spots_remaining = spots_remaining - 1
    WHERE id = NEW.opportunity_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
    UPDATE volunteer_opportunities 
    SET spots_remaining = spots_remaining + 1
    WHERE id = OLD.opportunity_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update spots when RSVP changes
DROP TRIGGER IF EXISTS update_spots_trigger ON volunteer_rsvps;
CREATE TRIGGER update_spots_trigger
AFTER INSERT OR UPDATE OR DELETE ON volunteer_rsvps
FOR EACH ROW EXECUTE FUNCTION update_opportunity_spots();

-- Function to update volunteer total hours when attendance is marked
CREATE OR REPLACE FUNCTION update_volunteer_hours()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'attended' AND NEW.hours_worked IS NOT NULL THEN
    UPDATE volunteer_profiles 
    SET total_hours = total_hours + NEW.hours_worked
    WHERE id = NEW.volunteer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update volunteer hours
DROP TRIGGER IF EXISTS update_hours_trigger ON volunteer_rsvps;
CREATE TRIGGER update_hours_trigger
AFTER UPDATE ON volunteer_rsvps
FOR EACH ROW EXECUTE FUNCTION update_volunteer_hours();

-- ============================================================================
-- SAMPLE DATA (OPTIONAL - DELETE IF NOT NEEDED)
-- ============================================================================

-- Insert a sample next meeting (you can update this via dashboard)
INSERT INTO next_meeting (meeting_date, location, notes) 
VALUES (
  '2026-03-15 18:00:00-05',
  'Community Center - Main Hall',
  'Monthly board meeting to review scholarship applications and grant requests.'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these after the migration to verify everything works:

-- Check all tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'volunteer_opportunities', 'volunteer_profiles', 'volunteer_rsvps',
  'volunteer_announcements', 'announcement_reads', 'grants',
  'meeting_minutes', 'meeting_votes', 'meeting_comments', 'next_meeting'
);

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'volunteer_opportunities', 'volunteer_profiles', 'volunteer_rsvps',
  'volunteer_announcements', 'announcement_reads', 'grants',
  'meeting_minutes', 'meeting_votes', 'meeting_comments', 'next_meeting'
);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
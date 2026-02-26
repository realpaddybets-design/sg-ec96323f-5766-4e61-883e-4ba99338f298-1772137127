-- Volunteer Opportunities Table
CREATE TABLE volunteer_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location TEXT NOT NULL,
  total_spots INTEGER NOT NULL CHECK (total_spots > 0),
  filled_spots INTEGER DEFAULT 0 CHECK (filled_spots >= 0),
  category TEXT NOT NULL,
  requirements TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'full', 'cancelled')),
  CONSTRAINT spots_check CHECK (filled_spots <= total_spots)
);

-- Volunteer Profiles Table
CREATE TABLE volunteer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notify_email BOOLEAN DEFAULT true,
  notify_sms BOOLEAN DEFAULT false,
  interests TEXT[],
  hours_completed INTEGER DEFAULT 0,
  joined_date TIMESTAMPTZ DEFAULT NOW()
);

-- Volunteer RSVPs Table
CREATE TABLE volunteer_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES volunteer_opportunities(id) ON DELETE CASCADE,
  volunteer_id UUID REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
  rsvp_date TIMESTAMPTZ DEFAULT NOW(),
  cancellation_date TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(opportunity_id, volunteer_id)
);

-- Volunteer Announcements Table
CREATE TABLE volunteer_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
  send_email BOOLEAN DEFAULT true,
  send_sms BOOLEAN DEFAULT false,
  target_group TEXT DEFAULT 'all' CHECK (target_group IN ('all', 'active', 'specific')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_by UUID[] DEFAULT '{}'
);

-- Grants Archive Table
CREATE TABLE grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name TEXT NOT NULL,
  organization TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  amount_requested DECIMAL(10,2) NOT NULL,
  amount_approved DECIMAL(10,2),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'under_review')),
  application_date DATE NOT NULL,
  decision_date DATE,
  decided_by UUID REFERENCES auth.users(id),
  documents TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting Minutes Table
CREATE TABLE meeting_minutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_date DATE NOT NULL,
  title TEXT NOT NULL,
  document_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'discussion')),
  votes_approve UUID[] DEFAULT '{}',
  votes_deny UUID[] DEFAULT '{}',
  votes_discuss UUID[] DEFAULT '{}'
);

-- Meeting Comments Table
CREATE TABLE meeting_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  minutes_id UUID REFERENCES meeting_minutes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Next Meeting Table (single row)
CREATE TABLE next_meeting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  agenda_url TEXT,
  notes TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default next meeting row
INSERT INTO next_meeting (date, time, location, notes) 
VALUES (CURRENT_DATE + INTERVAL '7 days', '18:00', 'TBD', 'No meeting scheduled yet');

-- Indexes for performance
CREATE INDEX idx_opportunities_date ON volunteer_opportunities(event_date);
CREATE INDEX idx_opportunities_status ON volunteer_opportunities(status);
CREATE INDEX idx_rsvps_volunteer ON volunteer_rsvps(volunteer_id);
CREATE INDEX idx_rsvps_opportunity ON volunteer_rsvps(opportunity_id);
CREATE INDEX idx_grants_status ON grants(status);
CREATE INDEX idx_grants_date ON grants(application_date);
CREATE INDEX idx_minutes_status ON meeting_minutes(status);

-- Row Level Security Policies

-- Volunteer Opportunities: Public read, staff write
ALTER TABLE volunteer_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active opportunities"
  ON volunteer_opportunities FOR SELECT
  USING (status = 'active' OR status = 'full');

CREATE POLICY "Staff can manage opportunities"
  ON volunteer_opportunities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('owner', 'admin', 'staff')
    )
  );

-- Volunteer Profiles: Users can read/update own, staff can read all
ALTER TABLE volunteer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON volunteer_profiles FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.role IN ('owner', 'admin', 'staff')
  ));

CREATE POLICY "Users can update own profile"
  ON volunteer_profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own profile"
  ON volunteer_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Volunteer RSVPs: Users can manage own, staff can view all
ALTER TABLE volunteer_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Volunteers can view own RSVPs"
  ON volunteer_rsvps FOR SELECT
  USING (
    volunteer_id IN (SELECT id FROM volunteer_profiles WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('owner', 'admin', 'staff')
    )
  );

CREATE POLICY "Volunteers can create RSVPs"
  ON volunteer_rsvps FOR INSERT
  WITH CHECK (volunteer_id IN (SELECT id FROM volunteer_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Volunteers can update own RSVPs"
  ON volunteer_rsvps FOR UPDATE
  USING (volunteer_id IN (SELECT id FROM volunteer_profiles WHERE user_id = auth.uid()));

-- Volunteer Announcements: Staff write, volunteers read
ALTER TABLE volunteer_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Volunteers can view announcements"
  ON volunteer_announcements FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM volunteer_profiles WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('owner', 'admin', 'staff')
    )
  );

CREATE POLICY "Staff can create announcements"
  ON volunteer_announcements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('owner', 'admin', 'staff')
    )
  );

-- Grants: Staff only
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage grants"
  ON grants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('owner', 'admin', 'staff')
    )
  );

-- Meeting Minutes: Staff only
ALTER TABLE meeting_minutes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage meeting minutes"
  ON meeting_minutes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('owner', 'admin', 'staff')
    )
  );

-- Meeting Comments: Staff only
ALTER TABLE meeting_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage comments"
  ON meeting_comments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('owner', 'admin', 'staff')
    )
  );

-- Next Meeting: Staff only
ALTER TABLE next_meeting ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view next meeting"
  ON next_meeting FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('owner', 'admin', 'staff')
    )
  );

CREATE POLICY "Staff can update next meeting"
  ON next_meeting FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('owner', 'admin', 'staff')
    )
  );

-- Functions for automatic updates

-- Update filled_spots when RSVP is created/updated
CREATE OR REPLACE FUNCTION update_opportunity_spots()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE volunteer_opportunities
    SET filled_spots = filled_spots + 1,
        status = CASE WHEN filled_spots + 1 >= total_spots THEN 'full' ELSE status END
    WHERE id = NEW.opportunity_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
      UPDATE volunteer_opportunities
      SET filled_spots = filled_spots - 1,
          status = CASE WHEN filled_spots - 1 < total_spots THEN 'active' ELSE status END
      WHERE id = NEW.opportunity_id;
    ELSIF OLD.status = 'cancelled' AND NEW.status = 'confirmed' THEN
      UPDATE volunteer_opportunities
      SET filled_spots = filled_spots + 1,
          status = CASE WHEN filled_spots + 1 >= total_spots THEN 'full' ELSE status END
      WHERE id = NEW.opportunity_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
    UPDATE volunteer_opportunities
    SET filled_spots = filled_spots - 1,
        status = CASE WHEN filled_spots - 1 < total_spots THEN 'active' ELSE status END
    WHERE id = OLD.opportunity_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_spots_trigger
AFTER INSERT OR UPDATE OR DELETE ON volunteer_rsvps
FOR EACH ROW EXECUTE FUNCTION update_opportunity_spots();
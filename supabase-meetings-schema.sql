-- Meetings Management Schema
-- Create tables in correct order to avoid foreign key errors

-- 1. Create meetings table first (no dependencies)
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  meeting_type TEXT NOT NULL CHECK (meeting_type IN ('board', 'committee', 'emergency', 'annual', 'other')),
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create meeting_minutes table (depends on meetings)
CREATE TABLE IF NOT EXISTS public.meeting_minutes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL,
  minutes_text TEXT,
  document_url TEXT,
  uploaded_by UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'needs_discussion')),
  uploaded_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  review_notes TEXT
);

-- 3. Create meeting_attendees table (depends on meetings)
CREATE TABLE IF NOT EXISTS public.meeting_attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('attending', 'not_attending', 'maybe', 'pending')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(meeting_id, user_id)
);

-- 4. Create meeting_minute_votes table (depends on meeting_minutes)
CREATE TABLE IF NOT EXISTS public.meeting_minute_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  minute_id UUID NOT NULL,
  user_id UUID NOT NULL,
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'deny', 'discuss')),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(minute_id, user_id)
);

-- Now add foreign key constraints after all tables exist
ALTER TABLE public.meetings 
  ADD CONSTRAINT fk_meetings_created_by 
  FOREIGN KEY (created_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

ALTER TABLE public.meeting_minutes 
  ADD CONSTRAINT fk_minutes_meeting 
  FOREIGN KEY (meeting_id) REFERENCES public.meetings(id) ON DELETE CASCADE;

ALTER TABLE public.meeting_minutes 
  ADD CONSTRAINT fk_minutes_uploaded_by 
  FOREIGN KEY (uploaded_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

ALTER TABLE public.meeting_minutes 
  ADD CONSTRAINT fk_minutes_reviewed_by 
  FOREIGN KEY (reviewed_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

ALTER TABLE public.meeting_attendees 
  ADD CONSTRAINT fk_attendees_meeting 
  FOREIGN KEY (meeting_id) REFERENCES public.meetings(id) ON DELETE CASCADE;

ALTER TABLE public.meeting_attendees 
  ADD CONSTRAINT fk_attendees_user 
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.meeting_minute_votes 
  ADD CONSTRAINT fk_votes_minute 
  FOREIGN KEY (minute_id) REFERENCES public.meeting_minutes(id) ON DELETE CASCADE;

ALTER TABLE public.meeting_minute_votes 
  ADD CONSTRAINT fk_votes_user 
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_meetings_date ON public.meetings(meeting_date DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_created_by ON public.meetings(created_by);
CREATE INDEX IF NOT EXISTS idx_meeting_minutes_meeting ON public.meeting_minutes(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_minutes_status ON public.meeting_minutes(status);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_meeting ON public.meeting_attendees(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_attendees_user ON public.meeting_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_meeting_minute_votes_minute ON public.meeting_minute_votes(minute_id);
CREATE INDEX IF NOT EXISTS idx_meeting_minute_votes_user ON public.meeting_minute_votes(user_id);

-- Enable Row Level Security
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_minute_votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts on re-run)
DROP POLICY IF EXISTS "Staff can view all meetings" ON public.meetings;
DROP POLICY IF EXISTS "Admin and owner can create meetings" ON public.meetings;
DROP POLICY IF EXISTS "Admin and owner can update meetings" ON public.meetings;
DROP POLICY IF EXISTS "Admin and owner can delete meetings" ON public.meetings;
DROP POLICY IF EXISTS "Staff can view all meeting minutes" ON public.meeting_minutes;
DROP POLICY IF EXISTS "Staff can upload meeting minutes" ON public.meeting_minutes;
DROP POLICY IF EXISTS "Admin and owner can update meeting minutes" ON public.meeting_minutes;
DROP POLICY IF EXISTS "Staff can view all attendees" ON public.meeting_attendees;
DROP POLICY IF EXISTS "Staff can manage their own RSVP" ON public.meeting_attendees;
DROP POLICY IF EXISTS "Staff can view all votes" ON public.meeting_minute_votes;
DROP POLICY IF EXISTS "Staff can manage their own votes" ON public.meeting_minute_votes;

-- RLS Policies for meetings (all staff can view, admin/owner can create)
CREATE POLICY "Staff can view all meetings"
  ON public.meetings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Admin and owner can create meetings"
  ON public.meetings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Admin and owner can update meetings"
  ON public.meetings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Admin and owner can delete meetings"
  ON public.meetings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

-- RLS Policies for meeting_minutes (all staff can view and upload)
CREATE POLICY "Staff can view all meeting minutes"
  ON public.meeting_minutes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Staff can upload meeting minutes"
  ON public.meeting_minutes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Admin and owner can update meeting minutes"
  ON public.meeting_minutes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'owner')
    )
  );

-- RLS Policies for meeting_attendees (staff can manage their own RSVP)
CREATE POLICY "Staff can view all attendees"
  ON public.meeting_attendees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Staff can manage their own RSVP"
  ON public.meeting_attendees FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for meeting_minute_votes (staff can vote)
CREATE POLICY "Staff can view all votes"
  ON public.meeting_minute_votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Staff can manage their own votes"
  ON public.meeting_minute_votes FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create function to update meeting minutes status based on votes
CREATE OR REPLACE FUNCTION update_minutes_status_on_vote()
RETURNS TRIGGER AS $$
DECLARE
  total_voters INTEGER;
  approve_votes INTEGER;
  deny_votes INTEGER;
  discuss_votes INTEGER;
  vote_threshold NUMERIC;
BEGIN
  -- Count total eligible voters (staff members)
  SELECT COUNT(*) INTO total_voters
  FROM public.user_profiles
  WHERE role IN ('staff', 'admin', 'owner');

  -- Count votes for this minute
  SELECT 
    COUNT(*) FILTER (WHERE vote = 'approve'),
    COUNT(*) FILTER (WHERE vote = 'deny'),
    COUNT(*) FILTER (WHERE vote = 'discuss')
  INTO approve_votes, deny_votes, discuss_votes
  FROM public.meeting_minute_votes
  WHERE minute_id = NEW.minute_id;

  -- Calculate threshold (50% of total voters)
  vote_threshold := total_voters * 0.5;

  -- Update status based on vote counts
  IF approve_votes >= vote_threshold THEN
    UPDATE public.meeting_minutes
    SET status = 'approved', reviewed_at = now()
    WHERE id = NEW.minute_id;
  ELSIF deny_votes >= vote_threshold THEN
    UPDATE public.meeting_minutes
    SET status = 'denied', reviewed_at = now()
    WHERE id = NEW.minute_id;
  ELSIF discuss_votes > 0 THEN
    UPDATE public.meeting_minutes
    SET status = 'needs_discussion'
    WHERE id = NEW.minute_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic status updates
DROP TRIGGER IF EXISTS meeting_minute_vote_trigger ON public.meeting_minute_votes;
CREATE TRIGGER meeting_minute_vote_trigger
  AFTER INSERT OR UPDATE ON public.meeting_minute_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_minutes_status_on_vote();

-- Enable realtime for meetings (if realtime is enabled on your instance)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_minutes;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_attendees;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_minute_votes;
  END IF;
END $$;
-- Meetings Management Schema
-- Safe to run multiple times

-- Drop existing constraints first (if they exist)
DO $$ 
BEGIN
  ALTER TABLE IF EXISTS public.meeting_minutes DROP CONSTRAINT IF EXISTS fk_minutes_meeting;
  ALTER TABLE IF EXISTS public.meeting_minutes DROP CONSTRAINT IF EXISTS fk_minutes_uploaded_by;
  ALTER TABLE IF EXISTS public.meeting_minutes DROP CONSTRAINT IF EXISTS fk_minutes_reviewed_by;
  ALTER TABLE IF EXISTS public.meeting_attendees DROP CONSTRAINT IF EXISTS fk_attendees_meeting;
  ALTER TABLE IF EXISTS public.meeting_attendees DROP CONSTRAINT IF EXISTS fk_attendees_user;
  ALTER TABLE IF EXISTS public.meeting_minute_votes DROP CONSTRAINT IF EXISTS fk_votes_minute;
  ALTER TABLE IF EXISTS public.meeting_minute_votes DROP CONSTRAINT IF EXISTS fk_votes_user;
  ALTER TABLE IF EXISTS public.meetings DROP CONSTRAINT IF EXISTS fk_meetings_created_by;
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

-- Drop existing tables (cascading will handle dependencies)
DROP TABLE IF EXISTS public.meeting_minute_votes CASCADE;
DROP TABLE IF EXISTS public.meeting_attendees CASCADE;
DROP TABLE IF EXISTS public.meeting_minutes CASCADE;
DROP TABLE IF EXISTS public.meetings CASCADE;

-- 1. Create meetings table
CREATE TABLE public.meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  meeting_type TEXT NOT NULL CHECK (meeting_type IN ('board', 'committee', 'emergency', 'annual', 'other')),
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create meeting_minutes table
CREATE TABLE public.meeting_minutes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  minutes_text TEXT,
  document_url TEXT,
  uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'needs_discussion')),
  uploaded_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  review_notes TEXT
);

-- 3. Create meeting_attendees table
CREATE TABLE public.meeting_attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('attending', 'not_attending', 'maybe', 'pending')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(meeting_id, user_id)
);

-- 4. Create meeting_minute_votes table
CREATE TABLE public.meeting_minute_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  minute_id UUID NOT NULL REFERENCES public.meeting_minutes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'deny', 'discuss')),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(minute_id, user_id)
);

-- Create indexes
CREATE INDEX idx_meetings_date ON public.meetings(meeting_date DESC);
CREATE INDEX idx_meetings_created_by ON public.meetings(created_by);
CREATE INDEX idx_meeting_minutes_meeting ON public.meeting_minutes(meeting_id);
CREATE INDEX idx_meeting_minutes_status ON public.meeting_minutes(status);
CREATE INDEX idx_meeting_attendees_meeting ON public.meeting_attendees(meeting_id);
CREATE INDEX idx_meeting_attendees_user ON public.meeting_attendees(user_id);
CREATE INDEX idx_meeting_minute_votes_minute ON public.meeting_minute_votes(minute_id);
CREATE INDEX idx_meeting_minute_votes_user ON public.meeting_minute_votes(user_id);

-- Enable Row Level Security
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_minute_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meetings
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

-- RLS Policies for meeting_minutes
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

-- RLS Policies for meeting_attendees
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

-- RLS Policies for meeting_minute_votes
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
  -- Count total eligible voters
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

-- Create trigger
DROP TRIGGER IF EXISTS meeting_minute_vote_trigger ON public.meeting_minute_votes;
CREATE TRIGGER meeting_minute_vote_trigger
  AFTER INSERT OR UPDATE ON public.meeting_minute_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_minutes_status_on_vote();

-- Enable realtime
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_minutes;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_attendees;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_minute_votes;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
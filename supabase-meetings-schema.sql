-- Meetings Management Schema

-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  meeting_date timestamptz NOT NULL,
  location text,
  meeting_type text NOT NULL CHECK (meeting_type IN ('board', 'committee', 'emergency', 'annual', 'other')),
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create meeting_minutes table
CREATE TABLE IF NOT EXISTS public.meeting_minutes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid REFERENCES public.meetings(id) ON DELETE CASCADE,
  minutes_text text,
  document_url text,
  uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'needs_discussion')),
  uploaded_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  review_notes text
);

-- Create meeting_attendees table for RSVP tracking
CREATE TABLE IF NOT EXISTS public.meeting_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid REFERENCES public.meetings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  rsvp_status text NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('attending', 'not_attending', 'maybe', 'pending')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(meeting_id, user_id)
);

-- Create meeting_minute_votes table for approve/deny/discuss on minutes
CREATE TABLE IF NOT EXISTS public.meeting_minute_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  minute_id uuid REFERENCES public.meeting_minutes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote text NOT NULL CHECK (vote IN ('approve', 'deny', 'discuss')),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(minute_id, user_id)
);

-- Enable RLS
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_minute_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meetings
CREATE POLICY "Staff can view all meetings"
  ON public.meetings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Admin/Owner can create meetings"
  ON public.meetings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Admin/Owner can update meetings"
  ON public.meetings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Owner can delete meetings"
  ON public.meetings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'owner'
    )
  );

-- RLS Policies for meeting_minutes
CREATE POLICY "Staff can view meeting minutes"
  ON public.meeting_minutes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Staff can upload meeting minutes"
  ON public.meeting_minutes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Admin/Owner can update meeting minutes"
  ON public.meeting_minutes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'owner')
    )
  );

-- RLS Policies for meeting_attendees
CREATE POLICY "Staff can view attendees"
  ON public.meeting_attendees FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Staff can manage their own RSVP"
  ON public.meeting_attendees FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can manage all RSVPs"
  ON public.meeting_attendees FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'owner')
    )
  );

-- RLS Policies for meeting_minute_votes
CREATE POLICY "Staff can view minute votes"
  ON public.meeting_minute_votes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Staff can vote on minutes"
  ON public.meeting_minute_votes FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin', 'owner')
    )
  );

CREATE POLICY "Staff can update their own votes"
  ON public.meeting_minute_votes FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_meetings_date ON public.meetings(meeting_date DESC);
CREATE INDEX idx_meeting_minutes_meeting ON public.meeting_minutes(meeting_id);
CREATE INDEX idx_meeting_minutes_status ON public.meeting_minutes(status);
CREATE INDEX idx_meeting_attendees_meeting ON public.meeting_attendees(meeting_id);
CREATE INDEX idx_meeting_attendees_user ON public.meeting_attendees(user_id);
CREATE INDEX idx_minute_votes_minute ON public.meeting_minute_votes(minute_id);

-- Create function to update meetings.updated_at
CREATE OR REPLACE FUNCTION update_meetings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for meetings
CREATE TRIGGER set_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_meetings_updated_at();

-- Create trigger for meeting_attendees
CREATE TRIGGER set_attendees_updated_at
  BEFORE UPDATE ON public.meeting_attendees
  FOR EACH ROW
  EXECUTE FUNCTION update_meetings_updated_at();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_minutes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_attendees;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_minute_votes;
-- Kelly's Angels Inc. Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (Staff/Admins)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'staff' CHECK (role IN ('staff', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Staff School Assignments (For Scholarship Permissions)
CREATE TABLE public.staff_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, school_name)
);

-- 3. Applications (Unified Table)
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Applicant Details
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  
  -- Grant Specifics
  type TEXT NOT NULL CHECK (type IN ('fun_grant', 'angel_aid', 'angel_hug', 'scholarship', 'hugs_ukraine')),
  school TEXT, -- Only for scholarships
  details TEXT, -- Story, essay, request details
  amount_requested NUMERIC,
  attachments TEXT[], -- URLs to storage
  
  -- Workflow
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'recommended', 'board_approved', 'denied', 'more_info')),
  recommendation_summary TEXT, -- Filled by staff when recommending
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Votes (Board Voting)
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'deny')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(application_id, user_id)
);

-- RLS POLICIES -----------------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Profiles: View own, Admin views all
CREATE POLICY "View own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Staff Assignments: Admin manages, Staff views own
CREATE POLICY "Admin manage assignments" ON staff_assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Staff view own assignments" ON staff_assignments FOR SELECT USING (
  user_id = auth.uid()
);

-- Applications:
-- 1. Insert: Public (anon)
CREATE POLICY "Public submit apps" ON applications FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 2. Select: Staff Logic
-- Complex logic: Admins see all. Staff see if assigned to school OR if grant type is NOT scholarship.
-- Board (all staff) see 'recommended' scholarships.
CREATE POLICY "Staff view logic" ON applications FOR SELECT TO authenticated USING (
  -- 1. Is Admin
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  OR
  -- 2. Not a scholarship (General grants visible to all staff)
  type != 'scholarship'
  OR
  -- 3. Is 'recommended' (Board view)
  status = 'recommended'
  OR
  -- 4. Is assigned school
  school IN (SELECT school_name FROM staff_assignments WHERE user_id = auth.uid())
);

-- 3. Update: Staff can update status/notes
CREATE POLICY "Staff update logic" ON applications FOR UPDATE TO authenticated USING (
   EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
   OR type != 'scholarship'
   OR status = 'recommended'
   OR school IN (SELECT school_name FROM staff_assignments WHERE user_id = auth.uid())
);

-- Trigger to handle new user signup -> profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'staff');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
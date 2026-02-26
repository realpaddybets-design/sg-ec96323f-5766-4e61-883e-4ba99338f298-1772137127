-- Create settings table for global configuration
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES auth.users(id)
);

-- Insert default settings
INSERT INTO public.app_settings (key, value, description)
VALUES 
    ('voting_thresholds', '{"grant_approval": 3, "scholarship_recommend": 3, "deny": 2}'::jsonb, 'Number of votes required for automatic actions')
ON CONFLICT (key) DO NOTHING;

-- Create activity logs table
CREATE TABLE IF NOT EXISTS public.staff_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) NOT NULL,
    action_type TEXT NOT NULL, -- 'vote', 'status_change', 'comment', 'upload', 'login'
    entity_type TEXT NOT NULL, -- 'application', 'grant', 'meeting'
    entity_id TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for settings (Read: Staff+, Write: Admin+)
CREATE POLICY "Staff can view settings" ON public.app_settings
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('staff', 'admin', 'owner'))
    );

CREATE POLICY "Admins can update settings" ON public.app_settings
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
    );

-- Policies for logs (Read: Admin/Owner, Write: Staff+)
CREATE POLICY "Admins can view all logs" ON public.staff_activity_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
    );

CREATE POLICY "Staff can view own logs" ON public.staff_activity_logs
    FOR SELECT USING (
        user_id = auth.uid()
    );

CREATE POLICY "Staff can create logs" ON public.staff_activity_logs
    FOR INSERT WITH CHECK (
        user_id = auth.uid()
    );

-- Add realtime
alter publication supabase_realtime add table public.staff_activity_logs;
alter publication supabase_realtime add table public.app_settings;
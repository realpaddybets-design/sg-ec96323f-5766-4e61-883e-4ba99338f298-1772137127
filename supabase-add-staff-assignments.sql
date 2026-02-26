-- ============================================================================
-- STAFF ASSIGNMENTS TABLE (MISSING FROM INITIAL MIGRATION)
-- ============================================================================
-- This table allows admins to assign staff members to specific high schools
-- Staff can only review scholarship applications from their assigned schools
-- ============================================================================

-- Create staff_assignments table
CREATE TABLE IF NOT EXISTS staff_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  school TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(staff_user_id, school)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_staff_assignments_user ON staff_assignments(staff_user_id);
CREATE INDEX IF NOT EXISTS idx_staff_assignments_school ON staff_assignments(school);

-- Enable RLS
ALTER TABLE staff_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for staff_assignments
-- Admins and owners can view all assignments
CREATE POLICY "Admins can view all staff assignments"
ON staff_assignments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role IN ('admin', 'owner')
  )
);

-- Staff can view their own assignments
CREATE POLICY "Staff can view own assignments"
ON staff_assignments FOR SELECT
TO authenticated
USING (staff_user_id = auth.uid());

-- Only admins and owners can insert/update/delete assignments
CREATE POLICY "Admins can manage staff assignments"
ON staff_assignments FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role IN ('admin', 'owner')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role IN ('admin', 'owner')
  )
);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_staff_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_staff_assignments_updated_at
BEFORE UPDATE ON staff_assignments
FOR EACH ROW
EXECUTE FUNCTION update_staff_assignments_updated_at();

-- ============================================================================
-- SAMPLE DATA (Optional - Remove if not needed)
-- ============================================================================
-- This assumes you have at least one staff user already created
-- Replace 'example@email.com' with an actual staff member's email

-- Example: Assign a staff member to Albany High School
-- INSERT INTO staff_assignments (staff_user_id, school)
-- SELECT id, 'Albany High School'
-- FROM user_profiles
-- WHERE email = 'staff@kellysangelsinc.org'
-- AND role = 'staff'
-- LIMIT 1;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor
-- After running, refresh your staff dashboard page
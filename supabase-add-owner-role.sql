-- Migration: Add Owner Role to Kelly's Angels Database
-- Run this in Supabase SQL Editor before creating your owner account

-- Step 1: Drop the existing role constraint
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- Step 2: Add new constraint that includes 'owner'
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('staff', 'admin', 'owner'));

-- Step 3: Verify the change
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'user_profiles_role_check';
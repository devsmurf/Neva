-- =====================================================
-- REVERT TO SUPABASE AUTH - DYNAMIC BACKEND
-- Migration: 20250905104801_revert_to_supabase_auth.sql
-- =====================================================

-- Drop custom auth tables and functions
DROP FUNCTION IF EXISTS admin_login(TEXT, TEXT);
DROP FUNCTION IF EXISTS contractor_login(TEXT, TEXT);
DROP TABLE IF EXISTS contractor_users CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Update profiles table to work properly with Supabase Auth
-- Keep existing structure but ensure it's linked to auth.users

-- Update the handle_new_user function to handle test users properly
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_company_id UUID;
BEGIN
  -- Check if email belongs to a company
  SELECT company_id INTO user_company_id
  FROM company_login_emails
  WHERE email = NEW.email AND is_active = true;

  -- Insert profile for new user
  INSERT INTO profiles (id, email, name, role, company_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    CASE 
      WHEN NEW.email IN ('admin@test.com', 'sef1@ronesans.com', 'sef2@ronesans.com') 
      THEN 'admin'
      ELSE 'user'
    END,
    user_company_id
  );
  RETURN NEW;
END;
$$;

-- Create test users in auth.users using Supabase Auth format
-- Note: These will be created via Dashboard or API, but we prepare the company mappings

-- Ensure test emails are in company_login_emails
INSERT INTO company_login_emails (company_id, email, is_active)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'contractor@test.com', true),
  (NULL, 'admin@test.com', true)  -- Admin doesn't need company
ON CONFLICT (email) DO UPDATE SET is_active = true;

-- =====================================================
-- SUPABASE AUTH INTEGRATION COMPLETE
-- =====================================================

COMMENT ON FUNCTION handle_new_user() IS 'Auto-creates profiles when users sign up via Supabase Auth';
COMMENT ON TABLE company_login_emails IS 'Maps companies to allowed login emails for Supabase Auth';

-- =====================================================
-- INSTRUCTIONS FOR MANUAL SETUP
-- =====================================================

-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Create these users manually:
--    - admin@test.com (password: AdminTest123!)
--    - contractor@test.com (password: ContractorTest123!)
-- 3. Profiles will be auto-created by the trigger

-- =====================================================
-- NEVA YALI PROJECT - MIGRATE TO SUPABASE AUTH
-- Migration: 20250904130001_migrate_to_supabase_auth.sql
-- =====================================================

-- Remove custom auth tables (we'll use Supabase Auth instead)
DROP TABLE IF EXISTS company_passwords CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Update profiles table to work with Supabase Auth
-- Keep existing profiles structure but ensure it works with auth.users
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_pkey CASCADE;

-- Recreate profiles table properly linked to auth.users
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'user', -- 'user' | 'admin'
  email TEXT,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add updated_at trigger
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- =====================================================
-- UPDATE RLS POLICIES FOR SUPABASE AUTH
-- =====================================================

-- Update helper functions to work with Supabase Auth
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION jwt_company_id() 
RETURNS UUID 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
AS $$
  SELECT company_id FROM profiles 
  WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION current_user_role() 
RETURNS TEXT 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
AS $$
  SELECT COALESCE(role, 'user') FROM profiles 
  WHERE id = auth.uid();
$$;

-- =====================================================
-- SEED ADMIN USERS IN SUPABASE AUTH
-- =====================================================

-- Note: Admin users will be created via Supabase Dashboard or API
-- We'll create profiles for them when they first login

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert profile for new user
  INSERT INTO profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    CASE 
      WHEN NEW.email IN ('admin@ronesans.com', 'sef1@ronesans.com', 'sef2@ronesans.com') 
      THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- COMPANY LOGIN SYSTEM (Magic Link Based)
-- =====================================================

-- Create a table to map companies to email domains for login
CREATE TABLE company_login_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add updated_at trigger
CREATE TRIGGER update_company_login_emails_updated_at 
    BEFORE UPDATE ON company_login_emails 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS for company_login_emails
ALTER TABLE company_login_emails ENABLE ROW LEVEL SECURITY;

-- Only admins can manage company login emails
CREATE POLICY "company_login_emails_admin_only" ON company_login_emails
  FOR ALL USING (is_admin());

-- =====================================================
-- SEED COMPANY LOGIN EMAILS
-- =====================================================

INSERT INTO company_login_emails (company_id, email) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'beta@betabeton.com'),
  ('550e8400-e29b-41d4-a716-446655440002', 'gamma@gammasiva.com'),
  ('550e8400-e29b-41d4-a716-446655440003', 'epsilon@epsilonalcipan.com'),
  ('550e8400-e29b-41d4-a716-446655440004', 'boyaci@boyaciltd.com'),
  ('550e8400-e29b-41d4-a716-446655440005', 'alfa@alfaelektrik.com')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- UPDATE PROFILE CREATION FOR COMPANY USERS
-- =====================================================

-- Update the handle_new_user function to assign company based on email
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
      WHEN NEW.email IN ('admin@ronesans.com', 'sef1@ronesans.com', 'sef2@ronesans.com') 
      THEN 'admin'
      ELSE 'user'
    END,
    user_company_id
  );
  RETURN NEW;
END;
$$;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE profiles IS 'User profiles linked to Supabase Auth users';
COMMENT ON TABLE company_login_emails IS 'Email addresses that can login for each company';
COMMENT ON FUNCTION handle_new_user() IS 'Creates profile when new user signs up via Supabase Auth';

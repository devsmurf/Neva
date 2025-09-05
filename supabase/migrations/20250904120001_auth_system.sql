-- =====================================================
-- NEVA YALI PROJECT - AUTHENTICATION SYSTEM MIGRATION
-- Migration: 20250904120001_auth_system.sql
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- COMPANY PASSWORD MANAGEMENT TABLE
-- =====================================================

-- Table for storing company passwords (set by admins)
CREATE TABLE company_passwords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE UNIQUE,
  password_hash TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger
CREATE TRIGGER company_passwords_updated_at
  BEFORE UPDATE ON company_passwords
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS Policies for company_passwords
ALTER TABLE company_passwords ENABLE ROW LEVEL SECURITY;

-- Only admins can manage company passwords
CREATE POLICY "company_passwords_admin_only" ON company_passwords
  FOR ALL USING (is_admin());

-- =====================================================
-- ADMIN USERS TABLE
-- =====================================================

-- Table for pre-defined admin users
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_first_login BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at trigger (function already created above)
CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS Policies for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can see admin users
CREATE POLICY "admin_users_admin_only" ON admin_users
  FOR ALL USING (is_admin());

-- =====================================================
-- UPDATE PROFILES TABLE
-- =====================================================

-- Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_first_login BOOLEAN DEFAULT true;

-- =====================================================
-- AUTHENTICATION HELPER FUNCTIONS
-- =====================================================

-- Function to verify company password
CREATE OR REPLACE FUNCTION verify_company_password(
  company_uuid UUID,
  password_input TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT password_hash INTO stored_hash 
  FROM company_passwords 
  WHERE company_id = company_uuid;
  
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Use crypt to verify password
  RETURN crypt(password_input, stored_hash) = stored_hash;
END;
$$;

-- Function to set company password (admin only)
CREATE OR REPLACE FUNCTION set_company_password(
  company_uuid UUID,
  new_password TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only admins can set passwords
  IF NOT is_admin() THEN
    RETURN FALSE;
  END IF;
  
  INSERT INTO company_passwords (company_id, password_hash, created_by)
  VALUES (
    company_uuid,
    crypt(new_password, gen_salt('bf')),
    auth.uid()
  )
  ON CONFLICT (company_id) 
  DO UPDATE SET 
    password_hash = crypt(new_password, gen_salt('bf')),
    updated_at = NOW();
    
  RETURN TRUE;
END;
$$;

-- Function to verify admin credentials
CREATE OR REPLACE FUNCTION verify_admin_credentials(
  email_input TEXT,
  password_input TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_id UUID;
  stored_hash TEXT;
BEGIN
  SELECT id, password_hash INTO admin_id, stored_hash
  FROM admin_users 
  WHERE email = email_input;
  
  IF stored_hash IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Verify password
  IF crypt(password_input, stored_hash) = stored_hash THEN
    RETURN admin_id;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Function to change admin password
CREATE OR REPLACE FUNCTION change_admin_password(
  admin_uuid UUID,
  new_password TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update password and mark as not first login
  UPDATE admin_users 
  SET 
    password_hash = crypt(new_password, gen_salt('bf')),
    is_first_login = false,
    updated_at = NOW()
  WHERE id = admin_uuid;
  
  RETURN FOUND;
END;
$$;

-- Function to get company info for contractor login
CREATE OR REPLACE FUNCTION get_company_for_login(company_uuid UUID)
RETURNS TABLE(
  id UUID,
  name TEXT,
  has_password BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    c.id,
    c.name,
    (cp.id IS NOT NULL) as has_password
  FROM companies c
  LEFT JOIN company_passwords cp ON c.id = cp.company_id
  WHERE c.id = company_uuid;
$$;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Index on company_passwords for faster lookups
CREATE INDEX IF NOT EXISTS idx_company_passwords_company_id ON company_passwords(company_id);

-- Index on admin_users for faster email lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE company_passwords IS 'Stores encrypted passwords for company logins, managed by admins';
COMMENT ON TABLE admin_users IS 'Pre-defined admin users with email/password authentication';
COMMENT ON FUNCTION verify_company_password IS 'Verifies contractor login credentials';
COMMENT ON FUNCTION verify_admin_credentials IS 'Verifies admin login credentials and returns admin ID';
COMMENT ON FUNCTION set_company_password IS 'Sets or updates company password (admin only)';
COMMENT ON FUNCTION change_admin_password IS 'Changes admin password and marks as not first login';

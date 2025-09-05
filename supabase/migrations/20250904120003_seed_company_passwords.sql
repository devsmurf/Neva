-- =====================================================
-- NEVA YALI PROJECT - SEED COMPANY PASSWORDS
-- Migration: 20250904120003_seed_company_passwords.sql
-- =====================================================

-- Set default passwords for all companies
-- Default password: "123456" (admins can change these)

-- Get the first admin user ID to use as creator
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM admin_users LIMIT 1;
  
  -- Set passwords for all existing companies
  INSERT INTO company_passwords (company_id, password_hash, created_by)
  SELECT 
    c.id,
    crypt('123456', gen_salt('bf')),
    admin_id
  FROM companies c
  ON CONFLICT (company_id) DO NOTHING;
END $$;


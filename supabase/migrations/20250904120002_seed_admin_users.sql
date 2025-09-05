-- =====================================================
-- NEVA YALI PROJECT - SEED ADMIN USERS
-- Migration: 20250904120002_seed_admin_users.sql
-- =====================================================

-- Insert default admin users
-- Password for all admins: "admin123" (they can change it on first login)

INSERT INTO admin_users (email, name, password_hash, is_first_login) VALUES
(
  'admin@ronesans.com',
  'Proje Şefi',
  crypt('admin123', gen_salt('bf')),
  true
),
(
  'sef1@ronesans.com', 
  'Site Şefi 1',
  crypt('admin123', gen_salt('bf')),
  true
),
(
  'sef2@ronesans.com',
  'Site Şefi 2', 
  crypt('admin123', gen_salt('bf')),
  true
);

-- Create corresponding profiles for admin users
INSERT INTO profiles (id, email, name, role, company_id, is_first_login)
SELECT 
  au.id,
  au.email,
  au.name,
  'admin',
  NULL, -- Admins don't belong to a specific company
  au.is_first_login
FROM admin_users au
ON CONFLICT (id) DO NOTHING;



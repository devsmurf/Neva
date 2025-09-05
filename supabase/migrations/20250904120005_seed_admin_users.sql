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

-- Admin users will use admin_users table directly
-- Profiles table is only for contractor users linked to auth.users
-- No need to create profiles for admin users

-- =====================================================
-- NEVA YALI PROJECT - FIX PROFILES TABLE
-- Migration: 20250904120004_fix_profiles.sql
-- =====================================================

-- Add missing columns to profiles table (if they don't exist)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_first_login BOOLEAN DEFAULT true;



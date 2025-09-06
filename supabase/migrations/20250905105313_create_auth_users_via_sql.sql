-- =====================================================
-- CREATE AUTH USERS VIA SQL - SUPABASE AUTH
-- Migration: 20250905105313_create_auth_users_via_sql.sql
-- =====================================================

-- Create admin user in auth.users (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@test.com') THEN
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'admin@test.com',
        crypt('AdminTest123!', gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Test Admin"}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    );
  END IF;
END $$;

-- Create contractor user in auth.users (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'contractor@test.com') THEN
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'contractor@test.com',
        crypt('ContractorTest123!', gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Test Contractor"}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    );
  END IF;
END $$;

-- Trigger will auto-create profiles for these users

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Show created users
SELECT 'Created Auth Users:' as info;
SELECT email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email IN ('admin@test.com', 'contractor@test.com');

-- Show auto-created profiles
SELECT 'Auto-created Profiles:' as info;
SELECT email, name, role, company_id 
FROM profiles 
WHERE email IN ('admin@test.com', 'contractor@test.com');

-- =====================================================
-- LOGIN CREDENTIALS
-- =====================================================
--
-- ADMIN: admin@test.com / AdminTest123!
-- CONTRACTOR: contractor@test.com / ContractorTest123!
--
-- =====================================================

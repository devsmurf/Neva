-- =====================================================
-- CREATE AUTH USERS DIRECTLY WITH SQL
-- Migration: 20250905103000_create_auth_users_direct.sql
-- =====================================================

-- Admin kullanıcısı oluştur
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@test.com',
    crypt('AdminTest123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Test Admin"}',
    false,
    now(),
    now()
);

-- Contractor kullanıcısı oluştur
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'contractor@test.com',
    crypt('ContractorTest123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Test Contractor"}',
    false,
    now(),
    now()
);

-- =====================================================
-- CREATE PROFILES FOR THE USERS
-- =====================================================

-- Admin profile oluştur
INSERT INTO profiles (
    id,
    email,
    name,
    role,
    company_id
) 
SELECT 
    au.id,
    'admin@test.com',
    'Test Admin',
    'admin',
    NULL
FROM auth.users au 
WHERE au.email = 'admin@test.com'
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    name = 'Test Admin',
    email = 'admin@test.com';

-- Contractor profile oluştur (Beta Beton şirketine bağlı)
INSERT INTO profiles (
    id,
    email,
    name,
    role,
    company_id
) 
SELECT 
    au.id,
    'contractor@test.com',
    'Test Contractor',
    'user',
    '550e8400-e29b-41d4-a716-446655440001'  -- Beta Beton company_id
FROM auth.users au 
WHERE au.email = 'contractor@test.com'
ON CONFLICT (id) DO UPDATE SET
    role = 'user',
    company_id = '550e8400-e29b-41d4-a716-446655440001',
    name = 'Test Contractor',
    email = 'contractor@test.com';

-- =====================================================
-- TEST USER CREDENTIALS
-- =====================================================
-- 
-- ADMIN PANEL:
-- Email: admin@test.com
-- Password: AdminTest123!
-- URL: /admin/login
-- 
-- CONTRACTOR PANEL (Beta Beton):  
-- Email: contractor@test.com
-- Password: ContractorTest123!
-- URL: /contractor/login
-- 
-- =====================================================

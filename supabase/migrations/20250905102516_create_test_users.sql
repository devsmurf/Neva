-- =====================================================
-- CREATE TEST USERS FOR ADMIN AND CONTRACTOR PANELS
-- Migration: 20250905102516_create_test_users.sql
-- =====================================================

-- NOT: Kullanıcılar Supabase Dashboard'dan manuel olarak oluşturulacak
-- Bu migration sadece company_login_emails tablosuna test email'i ekler

-- Test kullanıcıları için company_login_emails ekle
INSERT INTO company_login_emails (company_id, email, is_active)
VALUES ('550e8400-e29b-41d4-a716-446655440001', 'contractor@test.com', true)
ON CONFLICT (email) DO NOTHING;

-- Admin email'i de ekleyelim (admin rolü için özel)
INSERT INTO company_login_emails (company_id, email, is_active)
VALUES (NULL, 'admin@test.com', true)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- TEST USER CREDENTIALS
-- =====================================================
-- 
-- ADMIN PANEL:
-- Email: admin@test.com
-- Password: Admin123!
-- 
-- CONTRACTOR PANEL (Beta Beton):  
-- Email: contractor@test.com
-- Password: Contractor123!
-- 
-- =====================================================

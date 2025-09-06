-- =====================================================
-- FIX AUTH AND CREATE SEPARATE TABLES
-- Migration: 20250905103748_fix_auth_and_separate_tables.sql
-- =====================================================

-- Önce mevcut test kullanıcılarını silelim (güvenli olmayan şifreler)
DELETE FROM profiles WHERE email IN ('admin@test.com', 'contractor@test.com');
DELETE FROM auth.users WHERE email IN ('admin@test.com', 'contractor@test.com');

-- =====================================================
-- SEPARATE ADMIN AND CONTRACTOR TABLES
-- =====================================================

-- Admin users tablosu (şefler)
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contractor users tablosu (taşeronlar)
CREATE TABLE contractor_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated_at triggers
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractor_users_updated_at 
    BEFORE UPDATE ON contractor_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);
CREATE INDEX idx_contractor_users_email ON contractor_users(email);
CREATE INDEX idx_contractor_users_company ON contractor_users(company_id);
CREATE INDEX idx_contractor_users_active ON contractor_users(is_active);

-- =====================================================
-- CREATE TEST USERS WITH SECURE PASSWORDS
-- =====================================================

-- Admin test kullanıcısı oluştur
INSERT INTO admin_users (email, password_hash, name, role) VALUES 
('admin@test.com', crypt('AdminTest123!', gen_salt('bf')), 'Test Admin', 'admin');

-- Contractor test kullanıcısı oluştur (Beta Beton şirketine bağlı)
INSERT INTO contractor_users (email, password_hash, name, company_id) VALUES 
('contractor@test.com', crypt('ContractorTest123!', gen_salt('bf')), 'Test Contractor', '550e8400-e29b-41d4-a716-446655440001');

-- =====================================================
-- UPDATE HELPER FUNCTIONS FOR NEW TABLE STRUCTURE
-- =====================================================

-- Admin login function
CREATE OR REPLACE FUNCTION admin_login(input_email TEXT, input_password TEXT)
RETURNS TABLE(success BOOLEAN, user_id UUID, user_name TEXT, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record admin_users%ROWTYPE;
BEGIN
    -- Find user by email
    SELECT * INTO user_record 
    FROM admin_users 
    WHERE email = input_email AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Email bulunamadı'::TEXT;
        RETURN;
    END IF;
    
    -- Check password
    IF user_record.password_hash = crypt(input_password, user_record.password_hash) THEN
        -- Update last login
        UPDATE admin_users 
        SET last_login = now() 
        WHERE id = user_record.id;
        
        RETURN QUERY SELECT true, user_record.id, user_record.name, NULL::TEXT;
    ELSE
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Şifre hatalı'::TEXT;
    END IF;
END;
$$;

-- Contractor login function
CREATE OR REPLACE FUNCTION contractor_login(input_email TEXT, input_password TEXT)
RETURNS TABLE(success BOOLEAN, user_id UUID, user_name TEXT, company_id UUID, company_name TEXT, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record contractor_users%ROWTYPE;
    comp_name TEXT;
BEGIN
    -- Find user by email
    SELECT cu.* INTO user_record
    FROM contractor_users cu
    WHERE cu.email = input_email AND cu.is_active = true;
    
    -- Get company name separately
    SELECT c.name INTO comp_name
    FROM companies c
    WHERE c.id = user_record.company_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::UUID, NULL::TEXT, 'Email bulunamadı'::TEXT;
        RETURN;
    END IF;
    
    -- Check password
    IF user_record.password_hash = crypt(input_password, user_record.password_hash) THEN
        -- Update last login
        UPDATE contractor_users 
        SET last_login = now() 
        WHERE id = user_record.id;
        
        RETURN QUERY SELECT true, user_record.id, user_record.name, user_record.company_id, comp_name, NULL::TEXT;
    ELSE
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::UUID, NULL::TEXT, 'Şifre hatalı'::TEXT;
    END IF;
END;
$$;

-- =====================================================
-- RLS POLICIES FOR NEW TABLES
-- =====================================================

-- Admin users RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_users_select_own" ON admin_users
    FOR SELECT USING (true); -- Public read for login function

CREATE POLICY "admin_users_update_own" ON admin_users
    FOR UPDATE USING (true); -- Allow updates for login function

-- Contractor users RLS
ALTER TABLE contractor_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contractor_users_select_own" ON contractor_users
    FOR SELECT USING (true); -- Public read for login function

CREATE POLICY "contractor_users_update_own" ON contractor_users
    FOR UPDATE USING (true); -- Allow updates for login function

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE admin_users IS 'Admin/Şef kullanıcıları - Supabase Auth yerine custom auth';
COMMENT ON TABLE contractor_users IS 'Contractor/Taşeron kullanıcıları - şirketlere bağlı';
COMMENT ON FUNCTION admin_login IS 'Admin kullanıcı girişi için güvenli fonksiyon';
COMMENT ON FUNCTION contractor_login IS 'Contractor kullanıcı girişi için güvenli fonksiyon';

-- =====================================================
-- TEST DATA VERIFICATION
-- =====================================================

-- Test kullanıcılarını listele
SELECT 'Admin Users:' as info;
SELECT email, name, role, is_active, created_at FROM admin_users;

SELECT 'Contractor Users:' as info;
SELECT cu.email, cu.name, c.name as company_name, cu.is_active, cu.created_at 
FROM contractor_users cu
JOIN companies c ON cu.company_id = c.id;

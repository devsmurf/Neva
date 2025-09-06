-- Test kullanıcıları için SQL
-- Önce mevcut profiles tablosunu kontrol edelim
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Mevcut profiles verilerini görelim
SELECT * FROM profiles LIMIT 10;

-- Companies tablosunu kontrol edelim
SELECT * FROM companies LIMIT 5;

-- Company login emails kontrol
SELECT * FROM company_login_emails LIMIT 5;

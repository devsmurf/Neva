-- Mevcut durumu kontrol et
SELECT 'auth.users tablosu:' as table_info;
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
ORDER BY created_at DESC;

SELECT 'profiles tablosu:' as table_info;
SELECT id, email, name, role, company_id, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- Auth users ile profiles arasındaki ilişkiyi kontrol et
SELECT 'Users without profiles:' as info;
SELECT au.id, au.email, au.created_at
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

SELECT 'Profiles without auth users:' as info;
SELECT p.id, p.email, p.role
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE au.id IS NULL;

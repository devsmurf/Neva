-- Check all tables in public schema
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check profiles table structure
\d profiles;

-- Check company_login_emails table
\d company_login_emails;

-- Check companies with login emails
SELECT c.name, c.id, cle.email, cle.is_active
FROM companies c
LEFT JOIN company_login_emails cle ON c.id = cle.company_id
ORDER BY c.name;

-- Check tasks count
SELECT COUNT(*) as task_count FROM tasks;

-- Check projects
SELECT * FROM projects;

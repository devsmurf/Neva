-- =====================================================
-- NEVA YALI PROJECT - ROW LEVEL SECURITY POLICIES
-- Migration: 20250904110003_rls_policies.sql
-- =====================================================

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROJECTS POLICIES
-- =====================================================

-- Projects: All authenticated users can read active projects
DROP POLICY IF EXISTS "projects_select_policy" ON projects;
CREATE POLICY "projects_select_policy" ON projects
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND is_active = true
  );

-- Projects: Only admins can insert/update/delete projects
DROP POLICY IF EXISTS "projects_admin_policy" ON projects;
CREATE POLICY "projects_admin_policy" ON projects
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- COMPANIES POLICIES
-- =====================================================

-- Companies: All authenticated users can read companies
DROP POLICY IF EXISTS "companies_select_policy" ON companies;
CREATE POLICY "companies_select_policy" ON companies
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Companies: Only admins can modify companies
DROP POLICY IF EXISTS "companies_admin_policy" ON companies;
CREATE POLICY "companies_admin_policy" ON companies
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Profiles: Users can read their own profile, admins can read all
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT
  USING (
    is_admin() OR 
    id = auth.uid()
  );

-- Profiles: Only admins can insert profiles (during user creation)
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT
  WITH CHECK (is_admin());

-- Profiles: Users can update their own profile (limited fields), admins can update all
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE
  USING (
    is_admin() OR 
    id = auth.uid()
  )
  WITH CHECK (
    is_admin() OR (
      id = auth.uid() AND
      -- Non-admins cannot change their role or company_id
      role = (SELECT role FROM profiles WHERE id = auth.uid()) AND
      company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
    )
  );

-- Profiles: Only admins can delete profiles
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;
CREATE POLICY "profiles_delete_policy" ON profiles
  FOR DELETE
  USING (is_admin());

-- =====================================================
-- TASKS POLICIES
-- =====================================================

-- Tasks SELECT: Users can see approved tasks OR their own company's tasks, admins see all
DROP POLICY IF EXISTS "tasks_select_policy" ON tasks;
CREATE POLICY "tasks_select_policy" ON tasks
  FOR SELECT
  USING (
    is_admin() OR
    is_approved = true OR
    company_id = jwt_company_id()
  );

-- Tasks INSERT: Users can only create tasks for their own company, admins can create for any
DROP POLICY IF EXISTS "tasks_insert_policy" ON tasks;
CREATE POLICY "tasks_insert_policy" ON tasks
  FOR INSERT
  WITH CHECK (
    is_admin() OR (
      company_id = jwt_company_id() AND
      created_by = auth.uid() AND
      -- New tasks start as unapproved
      is_approved = false
    )
  );

-- Tasks UPDATE: Complex policy for different update scenarios
DROP POLICY IF EXISTS "tasks_update_policy" ON tasks;
CREATE POLICY "tasks_update_policy" ON tasks
  FOR UPDATE
  USING (
    is_admin() OR 
    company_id = jwt_company_id()
  )
  WITH CHECK (
    is_admin() OR (
      -- Non-admin users can only update their own company's tasks
      company_id = jwt_company_id() AND
      -- They cannot change approval status
      is_approved = (SELECT is_approved FROM tasks WHERE id = tasks.id) AND
      -- They cannot change company assignment
      company_id = (SELECT company_id FROM tasks WHERE id = tasks.id) AND
      -- They cannot change project assignment
      project_id = (SELECT project_id FROM tasks WHERE id = tasks.id) AND
      -- Set updated_by to current user
      updated_by = auth.uid()
    )
  );

-- Tasks DELETE: Users can delete their own unapproved tasks, admins can delete any
DROP POLICY IF EXISTS "tasks_delete_policy" ON tasks;
CREATE POLICY "tasks_delete_policy" ON tasks
  FOR DELETE
  USING (
    is_admin() OR (
      company_id = jwt_company_id() AND
      is_approved = false
    )
  );

-- =====================================================
-- ADMIN-ONLY POLICIES FOR SENSITIVE OPERATIONS
-- =====================================================

-- Special policy for admin task approval operations
DROP POLICY IF EXISTS "tasks_admin_approval_policy" ON tasks;
CREATE POLICY "tasks_admin_approval_policy" ON tasks
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- SECURITY FUNCTIONS FOR POLICY VALIDATION
-- =====================================================

-- Function to validate task update permissions
CREATE OR REPLACE FUNCTION validate_task_update(
  task_id UUID,
  new_is_approved BOOLEAN DEFAULT NULL,
  new_company_id UUID DEFAULT NULL,
  new_project_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_task tasks%ROWTYPE;
  user_role TEXT;
  user_company_id UUID;
BEGIN
  -- Get current task data
  SELECT * INTO current_task FROM tasks WHERE id = task_id;
  
  -- Get user info
  SELECT role, company_id INTO user_role, user_company_id 
  FROM profiles WHERE id = auth.uid();
  
  -- Admin can do anything
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Non-admin validations
  IF current_task.company_id != user_company_id THEN
    RETURN FALSE; -- Can't update other company's tasks
  END IF;
  
  -- Can't change approval status
  IF new_is_approved IS NOT NULL AND new_is_approved != current_task.is_approved THEN
    RETURN FALSE;
  END IF;
  
  -- Can't change company assignment
  IF new_company_id IS NOT NULL AND new_company_id != current_task.company_id THEN
    RETURN FALSE;
  END IF;
  
  -- Can't change project assignment  
  IF new_project_id IS NOT NULL AND new_project_id != current_task.project_id THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- =====================================================
-- POLICY TESTING FUNCTIONS (for development/debugging)
-- =====================================================

-- Function to test user permissions
CREATE OR REPLACE FUNCTION test_user_permissions(test_user_id UUID DEFAULT auth.uid())
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile profiles%ROWTYPE;
  can_read_projects BOOLEAN;
  can_read_companies BOOLEAN;
  can_read_tasks BOOLEAN;
  can_create_tasks BOOLEAN;
  result JSON;
BEGIN
  -- Get user profile
  SELECT * INTO user_profile FROM profiles WHERE id = test_user_id;
  
  -- Test basic read permissions
  can_read_projects := EXISTS(SELECT 1 FROM projects WHERE is_active = true LIMIT 1);
  can_read_companies := EXISTS(SELECT 1 FROM companies LIMIT 1);
  can_read_tasks := EXISTS(SELECT 1 FROM tasks LIMIT 1);
  
  -- Test create permissions (simplified)
  can_create_tasks := (user_profile.role = 'admin' OR user_profile.company_id IS NOT NULL);
  
  result := json_build_object(
    'user_id', test_user_id,
    'role', user_profile.role,
    'company_id', user_profile.company_id,
    'can_read_projects', can_read_projects,
    'can_read_companies', can_read_companies,
    'can_read_tasks', can_read_tasks,
    'can_create_tasks', can_create_tasks,
    'is_admin', (user_profile.role = 'admin')
  );
  
  RETURN result;
END;
$$;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON POLICY "projects_select_policy" ON projects IS 'All authenticated users can read active projects';
COMMENT ON POLICY "projects_admin_policy" ON projects IS 'Only admins can modify projects';

COMMENT ON POLICY "companies_select_policy" ON companies IS 'All authenticated users can read companies';
COMMENT ON POLICY "companies_admin_policy" ON companies IS 'Only admins can modify companies';

COMMENT ON POLICY "profiles_select_policy" ON profiles IS 'Users can read own profile, admins read all';
COMMENT ON POLICY "profiles_insert_policy" ON profiles IS 'Only admins can create profiles';
COMMENT ON POLICY "profiles_update_policy" ON profiles IS 'Limited self-update, admins update all';
COMMENT ON POLICY "profiles_delete_policy" ON profiles IS 'Only admins can delete profiles';

COMMENT ON POLICY "tasks_select_policy" ON tasks IS 'See approved tasks OR own company tasks, admins see all';
COMMENT ON POLICY "tasks_insert_policy" ON tasks IS 'Create tasks for own company only, admins for any';
COMMENT ON POLICY "tasks_update_policy" ON tasks IS 'Update own company tasks with restrictions, admins update all';
COMMENT ON POLICY "tasks_delete_policy" ON tasks IS 'Delete own unapproved tasks, admins delete any';

COMMENT ON FUNCTION validate_task_update(UUID, BOOLEAN, UUID, UUID) IS 'Validate task update permissions based on user role and ownership';
COMMENT ON FUNCTION test_user_permissions(UUID) IS 'Test and return user permissions summary for debugging';


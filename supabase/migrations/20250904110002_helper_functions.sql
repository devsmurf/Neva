-- =====================================================
-- NEVA YALI PROJECT - HELPER FUNCTIONS
-- Migration: 20250904110002_helper_functions.sql
-- =====================================================

-- =====================================================
-- AUTHENTICATION HELPER FUNCTIONS
-- =====================================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Function to get current user's company ID
CREATE OR REPLACE FUNCTION jwt_company_id() 
RETURNS UUID 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
AS $$
  SELECT company_id FROM profiles 
  WHERE id = auth.uid();
$$;

-- Function to get current user's role
CREATE OR REPLACE FUNCTION current_user_role() 
RETURNS TEXT 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
AS $$
  SELECT COALESCE(role, 'user') FROM profiles 
  WHERE id = auth.uid();
$$;

-- =====================================================
-- TASK HELPER FUNCTIONS
-- =====================================================

-- Function to check if a task can be updated by current user
CREATE OR REPLACE FUNCTION can_update_task(task_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    is_admin() OR 
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE id = task_id 
      AND company_id = jwt_company_id()
    );
$$;

-- Function to get task dependency status
CREATE OR REPLACE FUNCTION get_dependency_status(task_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  task_record tasks%ROWTYPE;
  dependent_tasks_completed BOOLEAN;
BEGIN
  -- Get the task record
  SELECT * INTO task_record FROM tasks WHERE id = task_id;
  
  -- If no dependent company, return 'none'
  IF task_record.dependent_company_id IS NULL THEN
    RETURN 'none';
  END IF;
  
  -- Check if all tasks from dependent company are completed
  SELECT COALESCE(
    bool_and(is_completed), 
    false
  ) INTO dependent_tasks_completed
  FROM tasks 
  WHERE company_id = task_record.dependent_company_id
  AND project_id = task_record.project_id
  AND is_approved = true;
  
  IF dependent_tasks_completed THEN
    RETURN 'ready';
  ELSE
    RETURN 'waiting';
  END IF;
END;
$$;

-- =====================================================
-- PROJECT STATISTICS FUNCTIONS
-- =====================================================

-- Function to get project progress statistics
CREATE OR REPLACE FUNCTION get_project_stats(project_uuid UUID)
RETURNS JSON
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
  approved_tasks INTEGER;
  pending_tasks INTEGER;
  in_progress_tasks INTEGER;
  overdue_tasks INTEGER;
  result JSON;
BEGIN
  -- Get basic counts
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE is_completed = true),
    COUNT(*) FILTER (WHERE is_approved = true),
    COUNT(*) FILTER (WHERE is_approved = false),
    COUNT(*) FILTER (WHERE status = 'in_progress' AND is_approved = true),
    COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND is_completed = false AND is_approved = true)
  INTO 
    total_tasks,
    completed_tasks, 
    approved_tasks,
    pending_tasks,
    in_progress_tasks,
    overdue_tasks
  FROM tasks 
  WHERE project_id = project_uuid;
  
  -- Build result JSON
  result := json_build_object(
    'total_tasks', total_tasks,
    'completed_tasks', completed_tasks,
    'approved_tasks', approved_tasks,
    'pending_tasks', pending_tasks,
    'in_progress_tasks', in_progress_tasks,
    'overdue_tasks', overdue_tasks,
    'completion_percentage', 
      CASE 
        WHEN approved_tasks > 0 THEN ROUND((completed_tasks::DECIMAL / approved_tasks::DECIMAL) * 100, 2)
        ELSE 0 
      END
  );
  
  RETURN result;
END;
$$;

-- Function to get company task statistics
CREATE OR REPLACE FUNCTION get_company_stats(company_uuid UUID, project_uuid UUID DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
  overdue_tasks INTEGER;
  result JSON;
BEGIN
  -- Get counts with optional project filter
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE is_completed = true),
    COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND is_completed = false AND is_approved = true)
  INTO 
    total_tasks,
    completed_tasks,
    overdue_tasks
  FROM tasks 
  WHERE company_id = company_uuid
  AND is_approved = true
  AND (project_uuid IS NULL OR project_id = project_uuid);
  
  result := json_build_object(
    'total_tasks', total_tasks,
    'completed_tasks', completed_tasks,
    'overdue_tasks', overdue_tasks,
    'completion_percentage', 
      CASE 
        WHEN total_tasks > 0 THEN ROUND((completed_tasks::DECIMAL / total_tasks::DECIMAL) * 100, 2)
        ELSE 0 
      END
  );
  
  RETURN result;
END;
$$;

-- =====================================================
-- NOTIFICATION FUNCTIONS
-- =====================================================

-- Function to create task notification
CREATE OR REPLACE FUNCTION notify_task_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Notify about task changes for real-time updates
  PERFORM pg_notify(
    'task_changes',
    json_build_object(
      'action', TG_OP,
      'task_id', COALESCE(NEW.id, OLD.id),
      'company_id', COALESCE(NEW.company_id, OLD.company_id),
      'project_id', COALESCE(NEW.project_id, OLD.project_id)
    )::text
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger for task notifications
CREATE TRIGGER task_change_notification
  AFTER INSERT OR UPDATE OR DELETE ON tasks
  FOR EACH ROW EXECUTE FUNCTION notify_task_change();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION is_admin() IS 'Check if current authenticated user has admin role';
COMMENT ON FUNCTION jwt_company_id() IS 'Get company ID of current authenticated user';
COMMENT ON FUNCTION current_user_role() IS 'Get role of current authenticated user';
COMMENT ON FUNCTION can_update_task(UUID) IS 'Check if current user can update specified task';
COMMENT ON FUNCTION get_dependency_status(UUID) IS 'Get dependency status for a task (none/waiting/ready)';
COMMENT ON FUNCTION get_project_stats(UUID) IS 'Get comprehensive statistics for a project';
COMMENT ON FUNCTION get_company_stats(UUID, UUID) IS 'Get task statistics for a company, optionally filtered by project';


-- =====================================================
-- NEVA YALI PROJECT - INITIAL TABLES SETUP
-- Migration: 20250904110001_init_tables.sql
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM for task status
CREATE TYPE task_status AS ENUM ('planned', 'in_progress');

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- COMPANIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  block_prefix TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- PROFILES TABLE (links to auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'user', -- 'user' | 'admin'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- TASKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  
  -- Location fields
  block TEXT NOT NULL,
  floor INTEGER,
  floor_from INTEGER,
  floor_to INTEGER,
  
  -- Task details
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status task_status NOT NULL DEFAULT 'planned',
  
  -- State flags
  is_completed BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  
  -- Additional info
  notes TEXT,
  dependent_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  
  -- Audit fields
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT chk_dates CHECK (start_date <= due_date),
  CONSTRAINT chk_floor_range CHECK (
    (floor IS NULL AND floor_from IS NOT NULL AND floor_to IS NOT NULL AND floor_from <= floor_to) OR
    (floor IS NOT NULL AND floor_from IS NULL AND floor_to IS NULL) OR
    (floor IS NULL AND floor_from IS NULL AND floor_to IS NULL)
  )
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_end_date ON projects(end_date);

-- Companies indexes
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_company_id ON tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_is_approved ON tasks(is_approved);
CREATE INDEX IF NOT EXISTS idx_tasks_is_completed ON tasks(is_completed);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_dependent_company_id ON tasks(dependent_company_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tasks_approved_completed ON tasks(is_approved, is_completed);
CREATE INDEX IF NOT EXISTS idx_tasks_company_approved ON tasks(company_id, is_approved);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for all tables
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE projects IS 'Construction projects';
COMMENT ON TABLE companies IS 'Contractor companies';
COMMENT ON TABLE profiles IS 'User profiles linked to auth.users';
COMMENT ON TABLE tasks IS 'Project tasks assigned to companies';

COMMENT ON COLUMN tasks.floor IS 'Single floor number (mutually exclusive with floor_from/floor_to)';
COMMENT ON COLUMN tasks.floor_from IS 'Starting floor for multi-floor tasks';
COMMENT ON COLUMN tasks.floor_to IS 'Ending floor for multi-floor tasks';
COMMENT ON COLUMN tasks.dependent_company_id IS 'Company this task depends on';
COMMENT ON COLUMN tasks.is_approved IS 'Admin approval status';
COMMENT ON COLUMN tasks.is_completed IS 'Task completion status';


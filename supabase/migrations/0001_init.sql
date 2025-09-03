-- ENUM
create type task_status as enum ('planned','in_progress');

-- PROJECTS
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  end_date date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- COMPANIES
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  block_prefix text,
  created_at timestamptz not null default now()
);

-- PROFILES (link to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id),
  role text not null default 'user', -- 'user' | 'admin'
  created_at timestamptz not null default now()
);

-- TASKS
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  company_id uuid not null references companies(id) on delete restrict,
  block text not null,
  title text not null,
  start_date date not null,
  due_date date not null,
  status task_status not null,
  is_completed boolean not null default false,
  is_approved boolean not null default false,
  notes text,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_dates check (start_date <= due_date)
);

create index if not exists tasks_project_id_idx on tasks(project_id);
create index if not exists tasks_company_id_idx on tasks(company_id);
create index if not exists tasks_is_approved_idx on tasks(is_approved);
create index if not exists tasks_is_completed_idx on tasks(is_completed);

-- Helper functions
create or replace function is_admin() returns boolean language sql stable as $$
  select coalesce(auth.jwt() ->> 'role', '') = 'admin';
$$;

create or replace function jwt_company_id() returns uuid language sql stable as $$
  select nullif(auth.jwt() ->> 'company_id','')::uuid;
$$;

-- RLS
alter table projects enable row level security;
alter table companies enable row level security;
alter table profiles enable row level security;
alter table tasks enable row level security;

-- companies: everyone can read
drop policy if exists companies_select_all on companies;
create policy companies_select_all on companies
for select using (auth.uid() is not null);

-- projects: everyone can read
drop policy if exists projects_select_all on projects;
create policy projects_select_all on projects
for select using (auth.uid() is not null);

-- profiles: self or admin
drop policy if exists profiles_self on profiles;
create policy profiles_self on profiles for select
  using (is_admin() or id = auth.uid());

-- tasks SELECT: approved OR own-company OR admin
drop policy if exists tasks_select on tasks;
create policy tasks_select on tasks for select
  using (
    is_admin()
    or is_approved = true
    or company_id = jwt_company_id()
  );

-- tasks INSERT: only own company
drop policy if exists tasks_insert on tasks;
create policy tasks_insert on tasks for insert
  with check (
    is_admin() or company_id = jwt_company_id()
  );

-- tasks UPDATE: only own company, is_approved only admin
drop policy if exists tasks_update on tasks;
create policy tasks_update on tasks for update
  using (is_admin() or company_id = jwt_company_id())
  with check (
    is_admin() or (company_id = jwt_company_id() and is_approved = (select is_approved from tasks where id = tasks.id))
  );

-- tasks DELETE: own company or admin
drop policy if exists tasks_delete on tasks;
create policy tasks_delete on tasks for delete
  using (is_admin() or company_id = jwt_company_id());

-- Seed example (optional)
-- insert into projects (name, end_date) values ('Neva Yalı', '2025-12-31');
-- insert into companies (name) values ('Beta Beton'),('Gamma Sıva'),('Epsilon Alçıpan'),('Boyacı Ltd.'),('Alfa Elektrik');
-- Add admin profile after creating auth user in Supabase console:
-- insert into profiles (id, company_id, role) values ('<admin_user_id>', null, 'admin');
-- Example task:
-- insert into tasks (project_id, company_id, block, title, start_date, due_date, status, is_approved)
-- select p.id, c.id, 'A', 'Şap dökümü - 3. kat', '2025-09-01','2025-09-05','in_progress', true
-- from projects p join companies c on c.name='Beta Beton' where p.name='Neva Yalı';


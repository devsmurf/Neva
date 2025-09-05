-- =====================================================
-- NEVA YALI PROJECT - SEED DATA
-- Migration: 20250904110004_seed_data.sql
-- =====================================================

-- =====================================================
-- INSERT PROJECTS
-- =====================================================

INSERT INTO projects (id, name, end_date, is_active) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Neva Yalı', '2025-12-29', true)
ON CONFLICT (name) DO UPDATE SET
  end_date = EXCLUDED.end_date,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- =====================================================
-- INSERT COMPANIES
-- =====================================================

INSERT INTO companies (id, name, block_prefix) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Beta Beton', 'BB'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Gamma Sıva', 'GS'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Epsilon Alçıpan', 'EA'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Boyacı Ltd.', 'BL'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Alfa Elektrik', 'AE')
ON CONFLICT (name) DO UPDATE SET
  block_prefix = EXCLUDED.block_prefix,
  updated_at = now();

-- =====================================================
-- INSERT BASIC TASKS (without dependencies)
-- =====================================================

INSERT INTO tasks (
  id, project_id, company_id, block, floor, title, 
  start_date, due_date, status, is_completed, is_approved
) VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'A Blok', 3, 'Şap dökümü - 3. kat',
    CURRENT_DATE, CURRENT_DATE, 'in_progress', false, true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440002',
    'B Blok', NULL, 'Alçı sıva - 2. kat',
    '2025-09-06', '2025-09-10', 'planned', false, true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440003',
    'C Blok', -1, 'Alçıpan tavan - lobi',
    '2025-09-01', '2025-09-03', 'in_progress', true, true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440005',
    'B Blok', NULL, 'Elektrik pano montajı',
    '2025-08-25', '2025-08-30', 'in_progress', true, true
  ),
  -- Pending approval tasks
  (
    '550e8400-e29b-41d4-a716-446655440016',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440004',
    'A Blok', 5, 'Boyama - 5. kat',
    '2025-09-10', '2025-09-20', 'planned', false, false
  ),
  (
    '550e8400-e29b-41d4-a716-446655440018',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440002',
    'C Blok', 8, 'Dış cephe mantolama',
    '2025-10-01', '2025-10-15', 'planned', false, false
  ),
  (
    '550e8400-e29b-41d4-a716-446655440019',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440003',
    'B Blok', 4, 'Asma tavan montajı - 4. kat',
    '2025-09-20', '2025-09-30', 'planned', false, false
  ),
  -- Overdue tasks
  (
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'A Blok', 7, 'Şap düzeltme ve tesviye - 7. kat',
    CURRENT_DATE - INTERVAL '8 days',
    CURRENT_DATE - INTERVAL '5 days',
    'in_progress', false, true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440002',
    'B Blok', NULL, 'Alçı sıva detay düzeltmeleri',
    CURRENT_DATE - INTERVAL '6 days',
    CURRENT_DATE - INTERVAL '3 days',
    'planned', false, true
  ),
  -- Future tasks
  (
    '550e8400-e29b-41d4-a716-446655440023',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440004',
    'D Blok', 2, 'Astar uygulaması - 2. kat',
    CURRENT_DATE + INTERVAL '1 day',
    CURRENT_DATE + INTERVAL '7 days',
    'planned', false, true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440024',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440005',
    'E Blok', NULL, 'Elektrik priz montajı - 1–2. kat',
    CURRENT_DATE + INTERVAL '2 days',
    CURRENT_DATE + INTERVAL '10 days',
    'planned', false, true
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  start_date = EXCLUDED.start_date,
  due_date = EXCLUDED.due_date,
  status = EXCLUDED.status,
  is_completed = EXCLUDED.is_completed,
  is_approved = EXCLUDED.is_approved,
  updated_at = now();

-- =====================================================
-- INSERT TASKS WITH FLOOR RANGES
-- =====================================================

INSERT INTO tasks (
  id, project_id, company_id, block, floor_from, floor_to, title,
  start_date, due_date, status, is_completed, is_approved
) VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440015',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440005',
    'B Blok', -2, -1, 'Elektrik pano montajı - bodrum katları',
    '2025-08-25', '2025-08-30', 'in_progress', true, true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440025',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440002',
    'B Blok', 3, 4, 'Alçı sıva detay düzeltmeleri - 3-4. kat',
    CURRENT_DATE - INTERVAL '6 days',
    CURRENT_DATE - INTERVAL '3 days',
    'planned', false, true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440026',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440005',
    'E Blok', 1, 2, 'Elektrik priz montajı - 1-2. kat',
    CURRENT_DATE + INTERVAL '2 days',
    CURRENT_DATE + INTERVAL '10 days',
    'planned', false, true
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  floor_from = EXCLUDED.floor_from,
  floor_to = EXCLUDED.floor_to,
  start_date = EXCLUDED.start_date,
  due_date = EXCLUDED.due_date,
  status = EXCLUDED.status,
  is_completed = EXCLUDED.is_completed,
  is_approved = EXCLUDED.is_approved,
  updated_at = now();

-- =====================================================
-- INSERT TASKS WITH DEPENDENCIES
-- =====================================================

INSERT INTO tasks (
  id, project_id, company_id, block, floor, title,
  start_date, due_date, status, is_completed, is_approved, dependent_company_id
) VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440017',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'A Blok', 1, 'Seramik döşeme - 1. kat',
    '2025-09-15', '2025-09-25', 'planned', false, false,
    '550e8400-e29b-41d4-a716-446655440002'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440003',
    'C Blok', -2, 'Alçıpan taşıyıcı montajı - otopark',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '3 days',
    'in_progress', false, true,
    '550e8400-e29b-41d4-a716-446655440005'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  start_date = EXCLUDED.start_date,
  due_date = EXCLUDED.due_date,
  status = EXCLUDED.status,
  is_completed = EXCLUDED.is_completed,
  is_approved = EXCLUDED.is_approved,
  dependent_company_id = EXCLUDED.dependent_company_id,
  updated_at = now();

-- =====================================================
-- INSERT TASKS WITH FLOOR RANGES AND DEPENDENCIES
-- =====================================================

INSERT INTO tasks (
  id, project_id, company_id, block, floor_from, floor_to, title,
  start_date, due_date, status, is_completed, is_approved, dependent_company_id
) VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440014',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440002',
    'B Blok', 2, 5, 'Alçı sıva - 2-5. kat',
    '2025-09-06', '2025-09-10', 'planned', false, true,
    '550e8400-e29b-41d4-a716-446655440001'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440027',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'A Blok', 10, 12, 'Seramik döşeme - üst katlar',
    '2025-09-15', '2025-09-25', 'planned', false, false,
    '550e8400-e29b-41d4-a716-446655440002'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  floor_from = EXCLUDED.floor_from,
  floor_to = EXCLUDED.floor_to,
  start_date = EXCLUDED.start_date,
  due_date = EXCLUDED.due_date,
  status = EXCLUDED.status,
  is_completed = EXCLUDED.is_completed,
  is_approved = EXCLUDED.is_approved,
  dependent_company_id = EXCLUDED.dependent_company_id,
  updated_at = now();
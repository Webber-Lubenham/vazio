-- Add student user
INSERT INTO users (id, email, password, full_name, role, phone, is_verified, last_login, created_at, updated_at)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'franklima.flm@gmail.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Senh@123
  'Sarah Rackel Ferreira Lima',
  'student',
  NULL,
  true,
  NOW(),
  NOW(),
  NOW()
);

-- Add parent user
INSERT INTO users (id, email, password, full_name, role, phone, is_verified, last_login, created_at, updated_at)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'frankwebber33@hotmail.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Senh@123
  'Frank Webber',
  'parent',
  NULL,
  true,
  NOW(),
  NOW(),
  NOW()
);

-- Create responsible link
INSERT INTO responsible_links (id, student_id, parent_id, is_active, created_at, updated_at)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  true,
  NOW(),
  NOW()
);

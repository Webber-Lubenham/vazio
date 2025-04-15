-- Insert test student user
INSERT INTO users (id, user_id, email, password, full_name, role, phone, is_verified, last_login, created_at, updated_at)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
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

-- Insert test parent user
INSERT INTO users (id, user_id, email, password, full_name, role, phone, is_verified, last_login, created_at, updated_at)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
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

-- Create policies for users table
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policies for responsible_links table
CREATE POLICY "Parents can view their own links" ON responsible_links
  FOR SELECT
  USING (parent_id = auth.uid());

CREATE POLICY "Students can view their own links" ON responsible_links
  FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Parents can insert links" ON responsible_links
  FOR INSERT
  WITH CHECK (parent_id = auth.uid());

-- Create policies for locations table
CREATE POLICY "Users can view their own locations" ON locations
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own locations" ON locations
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

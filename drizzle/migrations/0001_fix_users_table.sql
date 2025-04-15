-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own data" ON users CASCADE;

-- Drop existing constraints with CASCADE
ALTER TABLE locations DROP CONSTRAINT IF EXISTS locations_user_id_users_id_fk CASCADE;
ALTER TABLE password_reset_tokens DROP CONSTRAINT IF EXISTS password_reset_tokens_user_id_users_id_fk CASCADE;
ALTER TABLE responsible_links DROP CONSTRAINT IF EXISTS responsible_links_student_id_users_id_fk CASCADE;
ALTER TABLE responsible_links DROP CONSTRAINT IF EXISTS responsible_links_parent_id_users_id_fk CASCADE;

-- Drop existing indexes
DROP INDEX IF EXISTS email_idx;
DROP INDEX IF EXISTS role_idx;

-- Drop existing columns with CASCADE
ALTER TABLE users DROP COLUMN IF EXISTS avatar_url CASCADE;
ALTER TABLE users DROP COLUMN IF EXISTS token_identifier CASCADE;
ALTER TABLE users DROP COLUMN IF EXISTS image CASCADE;
ALTER TABLE users DROP COLUMN IF EXISTS name CASCADE;
ALTER TABLE users DROP COLUMN IF EXISTS user_id CASCADE;

-- Add new columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS password text NOT NULL DEFAULT 'temp_password';
ALTER TABLE users ADD COLUMN IF NOT EXISTS role text DEFAULT 'student' NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login timestamp;

-- Create new indexes
CREATE INDEX IF NOT EXISTS email_idx ON users(email);
CREATE INDEX IF NOT EXISTS role_idx ON users(role);

-- Create new policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Create foreign key constraints
ALTER TABLE locations ADD CONSTRAINT locations_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE password_reset_tokens ADD CONSTRAINT password_reset_tokens_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE responsible_links ADD CONSTRAINT responsible_links_student_id_users_id_fk FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE responsible_links ADD CONSTRAINT responsible_links_parent_id_users_id_fk FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE;

-- Create unique constraint
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE(email);

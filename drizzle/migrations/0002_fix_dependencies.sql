-- Drop all constraints and policies first
DO $$
BEGIN
    -- Drop all foreign key constraints
    FOR r IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'users'::regclass 
        AND contype = 'f'
    LOOP
        EXECUTE 'ALTER TABLE ONLY users DROP CONSTRAINT ' || quote_ident(r.conname) || ' CASCADE';
    END LOOP;

    -- Drop all policies
    FOR r IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'users'
    LOOP
        EXECUTE 'DROP POLICY ' || quote_ident(r.policyname) || ' ON users CASCADE';
    END LOOP;

    -- Drop all indexes
    FOR r IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'users'
    LOOP
        EXECUTE 'DROP INDEX IF EXISTS ' || quote_ident(r.indexname) || ' CASCADE';
    END LOOP;

    -- Drop all columns
    FOR r IN 
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name NOT IN ('id', 'email', 'full_name', 'created_at', 'updated_at')
    LOOP
        EXECUTE 'ALTER TABLE users DROP COLUMN IF EXISTS ' || quote_ident(r.column_name) || ' CASCADE';
    END LOOP;
END;
$$;

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

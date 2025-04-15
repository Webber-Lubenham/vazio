-- Drop existing tables if they exist
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT
);

-- Create todos table
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);

-- Insert some sample data
INSERT INTO users (full_name, phone) VALUES
    ('João Silva', '11999999999'),
    ('Maria Santos', '11988888888');

INSERT INTO todos (title, completed) VALUES
    ('Comprar pão', FALSE),
    ('Ler um livro', TRUE); 
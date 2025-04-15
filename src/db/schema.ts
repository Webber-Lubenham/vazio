import { pgTable, uuid, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';

// Tipos de usuário
export const UserRole = {
  STUDENT: 'student',
  PARENT: 'parent',
  ADMIN: 'admin'
} as const;

// Tabela de usuários
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').defaultRandom(), // Adicionando user_id para manter compatibilidade com Supabase
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  fullName: text('full_name').notNull(),
  role: text('role').notNull().default(UserRole.STUDENT),
  phone: text('phone'),
  isVerified: boolean('is_verified').default(false),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
  roleIdx: index('role_idx').on(table.role),
  userIdx: index('user_id_idx').on(table.user_id),
}));

// Tabela de links entre alunos e responsáveis
export const responsibleLinks = pgTable('responsible_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => users.id).notNull(),
  parentId: uuid('parent_id').references(() => users.id).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  studentIdx: index('student_idx').on(table.studentId),
  parentIdx: index('parent_idx').on(table.parentId),
}));

// Tabela de localizações
export const locations = pgTable('locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
  accuracy: text('accuracy'),
  speed: text('speed'),
  heading: text('heading'),
  altitude: text('altitude'),
  timestamp: timestamp('timestamp').defaultNow(),
}, (table) => ({
  userIdx: index('user_idx').on(table.userId),
  timestampIdx: index('timestamp_idx').on(table.timestamp),
}));

// Tabela de tokens de recuperação de senha
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  isUsed: boolean('is_used').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  tokenIdx: index('token_idx').on(table.token),
  userIdx: index('reset_user_idx').on(table.userId),
})); 
import { z } from 'zod';

export const UserRole = {
  STUDENT: 'student',
  PARENT: 'parent',
  ADMIN: 'admin'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string(),
  role: z.enum([UserRole.STUDENT, UserRole.PARENT, UserRole.ADMIN]),
  phone: z.string().optional(),
  isVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string(),
  role: z.enum([UserRole.STUDENT, UserRole.PARENT]),
  phone: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const newPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

export type NewPasswordInput = z.infer<typeof newPasswordSchema>; 
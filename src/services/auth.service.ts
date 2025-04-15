import { supabase } from '../lib/supabase';
import { User } from '../models/user.model';
import { sendEmail } from '../utils/email';
import jwt from 'jsonwebtoken';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

  static async register(email: string, password: string, name: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Failed to create user');

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.sendVerificationEmail(user);
    return user;
  }

  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Invalid credentials');

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.name,
      isVerified: data.user.email_confirmed_at !== null,
      createdAt: new Date(data.user.created_at),
      updatedAt: new Date(),
    };

    const token = this.generateToken(user);
    return { user, token };
  }

  static async verifyEmail(token: string): Promise<void> {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) throw error;
  }

  static async requestPasswordReset(email: string): Promise<void> {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${this.FRONTEND_URL}/reset-password`,
    });

    if (error) throw error;
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  }

  private static generateToken(user: User): string {
    return jwt.sign(
      { 
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
      this.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

  private static async sendVerificationEmail(user: User): Promise<void> {
    const token = this.generateToken(user);
    const verificationUrl = `${this.FRONTEND_URL}/verify-email?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      html: `
        <h1>Welcome to our platform!</h1>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationUrl}">Verify Email</a>
      `,
    });
  }

  private static async sendPasswordResetEmail(user: User): Promise<void> {
    const token = this.generateToken(user);
    const resetUrl = `${this.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
      `,
    });
  }
} 
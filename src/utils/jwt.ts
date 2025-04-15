import jwt from 'jsonwebtoken';
import { users } from '../db/schema';
import { InferSelectModel } from 'drizzle-orm';

type User = InferSelectModel<typeof users>;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export const generateTokens = (user: User) => {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, type: 'access' | 'refresh') => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { userId: string; role?: string };
  } catch (error) {
    return null;
  }
}; 
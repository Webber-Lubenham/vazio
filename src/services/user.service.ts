import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { generateTokens } from '../utils/jwt';
import { InferInsertModel } from 'drizzle-orm';
import { logger } from '../utils/logger';

type NewUser = InferInsertModel<typeof users>;

export const createUser = async (userData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [user] = await db.insert(users).values({
      ...userData,
      password: hashedPassword,
    }).returning();
    return user;
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    return await db.select().from(users);
  } catch (error) {
    logger.error('Error getting users:', error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    logger.error('Error getting user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  } catch (error) {
    logger.error('Error getting user by email:', error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<NewUser>) => {
  try {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const [user] = await db.update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  } catch (error) {
    logger.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const [user] = await db.delete(users).where(eq(users.id, id)).returning();
    return user;
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const tokens = generateTokens(user);
    return { user, tokens };
  } catch (error) {
    logger.error('Error logging in user:', error);
    throw error;
  }
}; 
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { generateTokens, verifyToken } from '../utils/jwt';
import { sendEmail } from '../utils/email';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;
    const user = await UserService.createUser({ email, password, fullName });
    
    // Send welcome email
    await sendEmail({
      to: email,
      subject: 'Welcome to Vazio',
      html: `<h1>Welcome to Vazio!</h1><p>Thank you for registering, ${fullName}!</p>`
    });

    const { accessToken, refreshToken } = generateTokens(user);
    
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(400).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await UserService.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(400).json({ error: 'Login failed' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // In a real application, you might want to invalidate the refresh token
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(400).json({ error: 'Logout failed' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }

    const decoded = verifyToken(refreshToken, 'refresh');
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await UserService.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    
    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(400).json({ error: 'Token refresh failed' });
  }
}; 
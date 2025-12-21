import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/jwt';
import logger from '../lib/logger';

export async function register(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'user_exists',
          message: 'Username already exists',
          fields: { username: 'This username is already taken' },
        },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: 'user',
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    logger.info(`New user registered: ${username}`);

    return res.status(201).json({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    logger.error('Registration error:', error);
    return res.status(500).json({
      status: 'error',
      error: {
        code: 'internal_server_error',
        message: 'Failed to register user',
      },
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        error: {
          code: 'invalid_credentials',
          message: 'Invalid username or password',
        },
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        error: {
          code: 'invalid_credentials',
          message: 'Invalid username or password',
        },
      });
    }

    // Generate tokens
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    logger.info(`User logged in: ${username}`);

    return res.json({
      status: 'ok',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      error: {
        code: 'internal_server_error',
        message: 'Failed to log in',
      },
    });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    });

    return res.json({
      status: 'ok',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    return res.status(401).json({
      status: 'error',
      error: {
        code: 'invalid_token',
        message: 'Invalid or expired refresh token',
      },
    });
  }
}

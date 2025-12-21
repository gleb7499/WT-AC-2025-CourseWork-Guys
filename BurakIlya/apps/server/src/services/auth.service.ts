import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { UnauthorizedError, ConflictError } from '../lib/errors';

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'volunteer';
}

interface LoginInput {
  username: string;
  password: string;
}

export async function register(input: RegisterInput) {
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username: input.username }, { email: input.email }],
    },
  });

  if (existingUser) {
    if (existingUser.username === input.username) {
      throw new ConflictError('Username already taken');
    }
    throw new ConflictError('Email already registered');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(input.password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      passwordHash,
      role: input.role || 'user',
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

export async function login(input: LoginInput) {
  // Find user
  const user = await prisma.user.findUnique({
    where: { username: input.username },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Generate tokens
  const tokenPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}

export async function refresh(refreshToken: string) {
  // Verify refresh token
  const payload = verifyRefreshToken(refreshToken);

  // Check if user still exists
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  // Generate new access token
  const tokenPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);

  return { accessToken };
}

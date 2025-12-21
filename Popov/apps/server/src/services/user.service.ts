import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { NotFoundError, ValidationError } from '../lib/errors.js';

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
}

export async function getAllUsers(limit = 50, offset = 0) {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return {
    items: users,
    pagination: {
      limit,
      offset,
      total,
    },
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      bookings: {
        select: {
          id: true,
          startTime: true,
          endTime: true,
          purpose: true,
          status: true,
          room: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { startTime: 'desc' },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
}

export async function createUser(data: CreateUserData) {
  const { username, email, password, role = Role.STUDENT } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ValidationError('Email already in use');
    }
    if (existingUser.username === username) {
      throw new ValidationError('Username already in use');
    }
  }

  // Hash password with 12 rounds
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      role,
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

export async function updateUser(id: string, data: UpdateUserData) {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new NotFoundError('User');
  }

  // Check for unique constraint violations
  if (data.email || data.username) {
    const conflictUser = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              ...(data.email ? [{ email: data.email }] : []),
              ...(data.username ? [{ username: data.username }] : []),
            ],
          },
        ],
      },
    });

    if (conflictUser) {
      if (data.email && conflictUser.email === data.email) {
        throw new ValidationError('Email already in use');
      }
      if (data.username && conflictUser.username === data.username) {
        throw new ValidationError('Username already in use');
      }
    }
  }

  // Hash new password if provided
  const updateData: any = { ...data };
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 12);
    delete updateData.password;
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function deleteUser(id: string) {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new NotFoundError('User');
  }

  await prisma.user.delete({
    where: { id },
  });
}

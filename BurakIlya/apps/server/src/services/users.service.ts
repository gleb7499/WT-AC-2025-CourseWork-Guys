import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { NotFoundError, ForbiddenError } from '../lib/errors';
import { PaginationParams } from '../types';

export async function listUsers(params: PaginationParams) {
  const limit = params.limit || 50;
  const offset = params.offset || 0;

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
    data: users,
    pagination: {
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getUserById(id: string, requesterId?: string, requesterRole?: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  // Check permissions: admin or self
  if (requesterRole !== 'admin' && requesterId !== id) {
    throw new ForbiddenError('Cannot view other users');
  }

  return user;
}

export async function updateUser(
  id: string,
  data: {
    username?: string;
    email?: string;
    password?: string;
    role?: string;
  },
  requesterId?: string,
  requesterRole?: string
) {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  // Check permissions: admin or self
  if (requesterRole !== 'admin' && requesterId !== id) {
    throw new ForbiddenError('Cannot update other users');
  }

  // Only admin can change role
  if (data.role && requesterRole !== 'admin') {
    throw new ForbiddenError('Only admin can change user role');
  }

  const updateData: Record<string, unknown> = {};

  if (data.username) updateData.username = data.username;
  if (data.email) updateData.email = data.email;
  if (data.role) updateData.role = data.role;
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 12);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updated;
}

export async function deleteUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  await prisma.user.delete({
    where: { id },
  });
}

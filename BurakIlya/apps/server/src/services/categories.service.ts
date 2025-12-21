import prisma from '../lib/prisma';
import { NotFoundError } from '../lib/errors';
import { PaginationParams } from '../types';

interface CreateCategoryInput {
  name: string;
  description?: string;
  icon?: string;
}

interface UpdateCategoryInput {
  name?: string;
  description?: string;
  icon?: string;
}

export async function listCategories(params: PaginationParams) {
  const limit = params.limit || 50;
  const offset = params.offset || 0;

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      skip: offset,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.category.count(),
  ]);

  return {
    data: categories,
    pagination: {
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new NotFoundError('Category');
  }

  return category;
}

export async function createCategory(data: CreateCategoryInput) {
  const category = await prisma.category.create({
    data,
  });

  return category;
}

export async function updateCategory(id: string, data: UpdateCategoryInput) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new NotFoundError('Category');
  }

  const updated = await prisma.category.update({
    where: { id },
    data,
  });

  return updated;
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new NotFoundError('Category');
  }

  await prisma.category.delete({
    where: { id },
  });
}

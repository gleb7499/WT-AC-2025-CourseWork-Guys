import prisma from '../lib/prisma';
import { NotFoundError, ForbiddenError } from '../lib/errors';

interface CreateRequestInput {
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  locationLat?: number;
  locationLng?: number;
  locationAddress: string;
}

interface UpdateRequestInput {
  title?: string;
  description?: string;
  categoryId?: string;
  status?: 'new' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  locationLat?: number;
  locationLng?: number;
  locationAddress?: string;
}

interface ListRequestsParams {
  status?: string;
  categoryId?: string;
  userId?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  limit?: number;
  offset?: number;
}

export async function listRequests(params: ListRequestsParams) {
  const limit = params.limit || 50;
  const offset = params.offset || 0;

  const where: Record<string, unknown> = {};

  if (params.status) {
    where.status = params.status;
  }

  if (params.categoryId) {
    where.categoryId = params.categoryId;
  }

  if (params.userId) {
    where.userId = params.userId;
  }

  // Note: Location-based filtering would require PostGIS or custom logic
  // For MVP, we'll skip radius filtering

  const [requests, total] = await Promise.all([
    prisma.helpRequest.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        category: true,
        assignments: {
          include: {
            volunteer: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.helpRequest.count({ where }),
  ]);

  return {
    data: requests,
    pagination: {
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getRequestById(id: string) {
  const request = await prisma.helpRequest.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      category: true,
      assignments: {
        include: {
          volunteer: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });

  if (!request) {
    throw new NotFoundError('Help request');
  }

  return request;
}

export async function createRequest(data: CreateRequestInput) {
  const request = await prisma.helpRequest.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      category: true,
    },
  });

  return request;
}

export async function updateRequest(
  id: string,
  data: UpdateRequestInput,
  requesterId: string,
  requesterRole: string
) {
  const request = await prisma.helpRequest.findUnique({
    where: { id },
  });

  if (!request) {
    throw new NotFoundError('Help request');
  }

  // Check permissions: owner or admin
  if (requesterRole !== 'admin' && request.userId !== requesterId) {
    throw new ForbiddenError('Cannot update this request');
  }

  const updated = await prisma.helpRequest.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      category: true,
    },
  });

  return updated;
}

export async function deleteRequest(id: string, requesterId: string, requesterRole: string) {
  const request = await prisma.helpRequest.findUnique({
    where: { id },
  });

  if (!request) {
    throw new NotFoundError('Help request');
  }

  // Check permissions: owner (if status is new) or admin
  if (requesterRole !== 'admin') {
    if (request.userId !== requesterId) {
      throw new ForbiddenError('Cannot delete this request');
    }
    if (request.status !== 'new') {
      throw new ForbiddenError('Cannot delete request after it has been assigned');
    }
  }

  await prisma.helpRequest.delete({
    where: { id },
  });
}

import prisma from '../lib/prisma';
import { NotFoundError, ForbiddenError } from '../lib/errors';

interface CreateVolunteerInput {
  userId: string;
  bio?: string;
  locationLat?: number;
  locationLng?: number;
  categories?: string[];
}

interface UpdateVolunteerInput {
  bio?: string;
  locationLat?: number;
  locationLng?: number;
  categories?: string[];
}

interface ListVolunteersParams {
  categoryId?: string;
  rating?: number;
  limit?: number;
  offset?: number;
}

export async function listVolunteers(params: ListVolunteersParams) {
  const limit = params.limit || 50;
  const offset = params.offset || 0;

  const where: Record<string, unknown> = {};

  if (params.rating) {
    where.rating = { gte: params.rating };
  }

  // For category filtering, we need to check if the categoryId is in the categories array
  if (params.categoryId) {
    where.categories = {
      has: params.categoryId,
    };
  }

  const [volunteers, total] = await Promise.all([
    prisma.volunteerProfile.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { rating: 'desc' },
    }),
    prisma.volunteerProfile.count({ where }),
  ]);

  return {
    data: volunteers,
    pagination: {
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getVolunteerById(id: string) {
  const volunteer = await prisma.volunteerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!volunteer) {
    throw new NotFoundError('Volunteer profile');
  }

  return volunteer;
}

export async function getVolunteerByUserId(userId: string) {
  const volunteer = await prisma.volunteerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return volunteer;
}

export async function createVolunteer(data: CreateVolunteerInput) {
  const volunteer = await prisma.volunteerProfile.create({
    data: {
      userId: data.userId,
      bio: data.bio,
      locationLat: data.locationLat,
      locationLng: data.locationLng,
      categories: data.categories || [],
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return volunteer;
}

export async function updateVolunteer(
  id: string,
  data: UpdateVolunteerInput,
  requesterId: string,
  requesterRole: string
) {
  const volunteer = await prisma.volunteerProfile.findUnique({
    where: { id },
  });

  if (!volunteer) {
    throw new NotFoundError('Volunteer profile');
  }

  // Check permissions: admin or self
  if (requesterRole !== 'admin' && volunteer.userId !== requesterId) {
    throw new ForbiddenError('Cannot update this volunteer profile');
  }

  const updated = await prisma.volunteerProfile.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return updated;
}

export async function deleteVolunteer(id: string) {
  const volunteer = await prisma.volunteerProfile.findUnique({
    where: { id },
  });

  if (!volunteer) {
    throw new NotFoundError('Volunteer profile');
  }

  await prisma.volunteerProfile.delete({
    where: { id },
  });
}

export async function getVolunteerStats(id: string) {
  const volunteer = await prisma.volunteerProfile.findUnique({
    where: { id },
  });

  if (!volunteer) {
    throw new NotFoundError('Volunteer profile');
  }

  const [completedAssignments, reviews] = await Promise.all([
    prisma.assignment.count({
      where: {
        volunteerId: volunteer.userId,
        status: 'completed',
      },
    }),
    prisma.review.findMany({
      where: {
        volunteerId: volunteer.userId,
      },
      select: {
        rating: true,
      },
    }),
  ]);

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  return {
    totalHelps: completedAssignments,
    avgRating: Number(avgRating.toFixed(2)),
    reviewsCount: totalReviews,
  };
}

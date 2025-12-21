import prisma from '../lib/prisma';
import { NotFoundError, ForbiddenError, ValidationError } from '../lib/errors';

interface CreateReviewInput {
  assignmentId: string;
  userId: string;
  rating: number;
  comment?: string;
}

interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

interface ListReviewsParams {
  volunteerId?: string;
  limit?: number;
  offset?: number;
}

export async function listReviews(params: ListReviewsParams) {
  const limit = params.limit || 50;
  const offset = params.offset || 0;

  const where: Record<string, unknown> = {};

  if (params.volunteerId) {
    where.volunteerId = params.volunteerId;
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
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
        volunteer: {
          select: {
            id: true,
            username: true,
          },
        },
        assignment: {
          include: {
            request: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    data: reviews,
    pagination: {
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getReviewById(id: string) {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      volunteer: {
        select: {
          id: true,
          username: true,
        },
      },
      assignment: {
        include: {
          request: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (!review) {
    throw new NotFoundError('Review');
  }

  return review;
}

export async function createReview(data: CreateReviewInput) {
  // Check if assignment exists and is completed
  const assignment = await prisma.assignment.findUnique({
    where: { id: data.assignmentId },
    include: {
      request: true,
    },
  });

  if (!assignment) {
    throw new NotFoundError('Assignment');
  }

  if (assignment.status !== 'completed') {
    throw new ValidationError('Cannot review an assignment that is not completed');
  }

  // Check if user is the request owner
  if (assignment.request.userId !== data.userId) {
    throw new ForbiddenError('Only the request owner can leave a review');
  }

  // Check if review already exists for this assignment
  const existingReview = await prisma.review.findUnique({
    where: { assignmentId: data.assignmentId },
  });

  if (existingReview) {
    throw new ValidationError('Review already exists for this assignment');
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      assignmentId: data.assignmentId,
      userId: data.userId,
      volunteerId: assignment.volunteerId,
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      volunteer: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  // Update volunteer profile rating
  await updateVolunteerRating(assignment.volunteerId);

  return review;
}

export async function updateReview(
  id: string,
  data: UpdateReviewInput,
  requesterId: string,
  requesterRole: string
) {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new NotFoundError('Review');
  }

  // Check permissions: owner or admin
  if (requesterRole !== 'admin' && review.userId !== requesterId) {
    throw new ForbiddenError('Cannot update this review');
  }

  const updated = await prisma.review.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      volunteer: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  // Update volunteer profile rating
  await updateVolunteerRating(review.volunteerId);

  return updated;
}

export async function deleteReview(id: string) {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new NotFoundError('Review');
  }

  const volunteerId = review.volunteerId;

  await prisma.review.delete({
    where: { id },
  });

  // Update volunteer profile rating
  await updateVolunteerRating(volunteerId);
}

async function updateVolunteerRating(volunteerId: string) {
  const reviews = await prisma.review.findMany({
    where: { volunteerId },
    select: { rating: true },
  });

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  await prisma.volunteerProfile.updateMany({
    where: { userId: volunteerId },
    data: {
      rating: Number(avgRating.toFixed(2)),
    },
  });
}

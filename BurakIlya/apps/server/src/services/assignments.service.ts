import prisma from '../lib/prisma';
import { NotFoundError, ForbiddenError, ValidationError } from '../lib/errors';

interface CreateAssignmentInput {
  requestId: string;
  volunteerId?: string;
}

interface UpdateAssignmentInput {
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
}

interface ListAssignmentsParams {
  requestId?: string;
  volunteerId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export async function listAssignments(params: ListAssignmentsParams) {
  const limit = params.limit || 50;
  const offset = params.offset || 0;

  const where: Record<string, unknown> = {};

  if (params.requestId) {
    where.requestId = params.requestId;
  }

  if (params.volunteerId) {
    where.volunteerId = params.volunteerId;
  }

  if (params.status) {
    where.status = params.status;
  }

  const [assignments, total] = await Promise.all([
    prisma.assignment.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        request: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
            category: true,
          },
        },
        volunteer: {
          select: {
            id: true,
            username: true,
          },
        },
        review: true,
      },
      orderBy: { assignedAt: 'desc' },
    }),
    prisma.assignment.count({ where }),
  ]);

  return {
    data: assignments,
    pagination: {
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAssignmentById(id: string) {
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      request: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          category: true,
        },
      },
      volunteer: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      review: true,
    },
  });

  if (!assignment) {
    throw new NotFoundError('Assignment');
  }

  return assignment;
}

export async function createAssignment(
  data: CreateAssignmentInput,
  requesterId: string,
  requesterRole: string
) {
  // Check if request exists
  const request = await prisma.helpRequest.findUnique({
    where: { id: data.requestId },
  });

  if (!request) {
    throw new NotFoundError('Help request');
  }

  // Check if request is already assigned
  if (request.status !== 'new') {
    throw new ValidationError('Help request is already assigned or completed');
  }

  // Determine volunteer ID
  const volunteerId = data.volunteerId || requesterId;

  // Check if volunteer exists and has volunteer role
  const volunteer = await prisma.user.findUnique({
    where: { id: volunteerId },
  });

  if (!volunteer) {
    throw new NotFoundError('Volunteer user');
  }

  if (volunteer.role !== 'volunteer' && requesterRole !== 'admin') {
    throw new ForbiddenError('User is not a volunteer');
  }

  // Create assignment
  const assignment = await prisma.assignment.create({
    data: {
      requestId: data.requestId,
      volunteerId,
      status: 'assigned',
    },
    include: {
      request: {
        include: {
          category: true,
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

  // Update request status
  await prisma.helpRequest.update({
    where: { id: data.requestId },
    data: { status: 'assigned' },
  });

  return assignment;
}

export async function updateAssignment(
  id: string,
  data: UpdateAssignmentInput,
  requesterId: string,
  requesterRole: string
) {
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      request: true,
    },
  });

  if (!assignment) {
    throw new NotFoundError('Assignment');
  }

  // Check permissions: assigned volunteer or admin
  if (requesterRole !== 'admin' && assignment.volunteerId !== requesterId) {
    throw new ForbiddenError('Cannot update this assignment');
  }

  const updateData: Record<string, unknown> = {
    status: data.status,
  };

  // Set completedAt when status is completed
  if (data.status === 'completed') {
    updateData.completedAt = new Date();
    
    // Update volunteer profile stats
    const volunteerProfile = await prisma.volunteerProfile.findUnique({
      where: { userId: assignment.volunteerId },
    });

    if (volunteerProfile) {
      await prisma.volunteerProfile.update({
        where: { userId: assignment.volunteerId },
        data: {
          totalHelps: volunteerProfile.totalHelps + 1,
        },
      });
    }
  }

  const updated = await prisma.assignment.update({
    where: { id },
    data: updateData,
    include: {
      request: {
        include: {
          category: true,
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

  // Update request status based on assignment status
  await prisma.helpRequest.update({
    where: { id: assignment.requestId },
    data: { status: data.status === 'cancelled' ? 'new' : data.status },
  });

  return updated;
}

export async function deleteAssignment(id: string) {
  const assignment = await prisma.assignment.findUnique({
    where: { id },
  });

  if (!assignment) {
    throw new NotFoundError('Assignment');
  }

  await prisma.assignment.delete({
    where: { id },
  });

  // Reset request status to new
  await prisma.helpRequest.update({
    where: { id: assignment.requestId },
    data: { status: 'new' },
  });
}

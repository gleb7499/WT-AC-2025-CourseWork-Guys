import { BookingStatus, Role } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { NotFoundError, ForbiddenError, ConflictError, ValidationError } from '../lib/errors.js';

export interface CreateBookingData {
  roomId: string;
  userId: string;
  userRole: Role;
  startTime: string;
  endTime: string;
  purpose: string;
}

export interface UpdateBookingData {
  startTime?: string;
  endTime?: string;
  purpose?: string;
}

export interface BookingFilters {
  roomId?: string;
  userId?: string;
  date?: string;
  status?: BookingStatus;
  limit?: number;
  offset?: number;
}

// Time limits in hours
const TIME_LIMITS: Record<Role, number> = {
  ADMIN: Infinity,
  TEACHER: 4,
  STUDENT: 2,
};

function calculateDurationHours(startTime: Date, endTime: Date): number {
  const durationMs = endTime.getTime() - startTime.getTime();
  return durationMs / (1000 * 60 * 60);
}

function validateTimeLimit(startTime: Date, endTime: Date, role: Role) {
  const duration = calculateDurationHours(startTime, endTime);
  const limit = TIME_LIMITS[role];

  if (duration > limit) {
    throw new ValidationError(
      `${role} can book for maximum ${limit} hours. Your booking is ${duration.toFixed(1)} hours.`
    );
  }
}

async function checkConflicts(
  roomId: string,
  startTime: Date,
  endTime: Date,
  excludeBookingId?: string
) {
  const where: any = {
    roomId,
    status: BookingStatus.ACTIVE,
    OR: [
      // New booking starts during existing booking
      {
        AND: [
          { startTime: { lte: startTime } },
          { endTime: { gt: startTime } },
        ],
      },
      // New booking ends during existing booking
      {
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gte: endTime } },
        ],
      },
      // New booking completely contains existing booking
      {
        AND: [
          { startTime: { gte: startTime } },
          { endTime: { lte: endTime } },
        ],
      },
    ],
  };

  if (excludeBookingId) {
    where.id = { not: excludeBookingId };
  }

  const conflicts = await prisma.booking.findMany({
    where,
    select: {
      id: true,
      startTime: true,
      endTime: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return conflicts;
}

export async function getAllBookings(filters: BookingFilters = {}) {
  const { roomId, userId, date, status, limit = 50, offset = 0 } = filters;

  const where: any = {};

  if (roomId) {
    where.roomId = roomId;
  }

  if (userId) {
    where.userId = userId;
  }

  if (status) {
    where.status = status;
  }

  if (date) {
    const dateObj = new Date(date);
    const startOfDay = new Date(dateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);

    where.startTime = { gte: startOfDay, lte: endOfDay };
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        room: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    items: bookings,
    pagination: {
      limit,
      offset,
      total,
    },
  };
}

export async function getBookingById(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      room: true,
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

  if (!booking) {
    throw new NotFoundError('Booking');
  }

  return booking;
}

export async function createBooking(data: CreateBookingData) {
  const { roomId, userId, userRole, startTime, endTime, purpose } = data;

  const start = new Date(startTime);
  const end = new Date(endTime);

  // Validate time limit based on role
  validateTimeLimit(start, end, userRole);

  // Check if room exists
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new NotFoundError('Room');
  }

  // Check for conflicts
  const conflicts = await checkConflicts(roomId, start, end);

  if (conflicts.length > 0) {
    throw new ConflictError('Time slot is not available', { conflicts });
  }

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      roomId,
      userId,
      startTime: start,
      endTime: end,
      purpose,
      status: BookingStatus.ACTIVE,
    },
    include: {
      room: {
        select: {
          id: true,
          name: true,
          location: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return booking;
}

export async function updateBooking(
  id: string,
  userId: string,
  userRole: Role,
  data: UpdateBookingData
) {
  // Check if booking exists
  const existingBooking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!existingBooking) {
    throw new NotFoundError('Booking');
  }

  // Check permissions - only owner or admin can update
  if (existingBooking.userId !== userId && userRole !== Role.ADMIN) {
    throw new ForbiddenError('You can only update your own bookings');
  }

  // Validate time if provided
  const startTime = data.startTime ? new Date(data.startTime) : existingBooking.startTime;
  const endTime = data.endTime ? new Date(data.endTime) : existingBooking.endTime;

  if (startTime >= endTime) {
    throw new ValidationError('End time must be after start time');
  }

  // Validate time limit
  const ownerRole = userRole === Role.ADMIN ? existingBooking.userId : userRole;
  const owner = await prisma.user.findUnique({ where: { id: existingBooking.userId } });
  validateTimeLimit(startTime, endTime, owner?.role || Role.STUDENT);

  // Check for conflicts if time is being changed
  if (data.startTime || data.endTime) {
    const conflicts = await checkConflicts(existingBooking.roomId, startTime, endTime, id);

    if (conflicts.length > 0) {
      throw new ConflictError('Time slot is not available', { conflicts });
    }
  }

  // Update booking
  const updateData: any = {};
  if (data.startTime) updateData.startTime = startTime;
  if (data.endTime) updateData.endTime = endTime;
  if (data.purpose) updateData.purpose = data.purpose;

  const booking = await prisma.booking.update({
    where: { id },
    data: updateData,
    include: {
      room: {
        select: {
          id: true,
          name: true,
          location: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return booking;
}

export async function deleteBooking(id: string, userId: string, userRole: Role) {
  // Check if booking exists
  const existingBooking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!existingBooking) {
    throw new NotFoundError('Booking');
  }

  // Check permissions - only owner or admin can delete
  if (existingBooking.userId !== userId && userRole !== Role.ADMIN) {
    throw new ForbiddenError('You can only cancel your own bookings');
  }

  // Update status to CANCELLED instead of hard delete
  await prisma.booking.update({
    where: { id },
    data: { status: BookingStatus.CANCELLED },
  });
}

export async function getSchedule(filters: {
  roomId?: string;
  date?: string;
  from?: string;
  to?: string;
}) {
  const { roomId, date, from, to } = filters;

  const where: any = {
    status: BookingStatus.ACTIVE,
  };

  if (roomId) {
    where.roomId = roomId;
  }

  if (date) {
    const dateObj = new Date(date);
    const startOfDay = new Date(dateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);

    where.startTime = { gte: startOfDay, lte: endOfDay };
  } else if (from && to) {
    where.startTime = { gte: new Date(from) };
    where.endTime = { lte: new Date(to) };
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      room: {
        select: {
          id: true,
          name: true,
          location: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: { startTime: 'asc' },
  });

  return bookings;
}

export async function checkScheduleConflicts(
  roomId: string,
  startTime: string,
  endTime: string
) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const conflicts = await checkConflicts(roomId, start, end);

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
  };
}

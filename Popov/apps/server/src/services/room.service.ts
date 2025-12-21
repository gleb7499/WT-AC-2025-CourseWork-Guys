import prisma from '../lib/prisma.js';
import { NotFoundError } from '../lib/errors.js';

export interface CreateRoomData {
  name: string;
  description?: string;
  capacity: number;
  equipment?: string;
  location: string;
}

export interface UpdateRoomData {
  name?: string;
  description?: string;
  capacity?: number;
  equipment?: string;
  location?: string;
}

export interface RoomFilters {
  capacity?: number;
  equipment?: string;
  location?: string;
  limit?: number;
  offset?: number;
}

export async function getAllRooms(filters: RoomFilters = {}) {
  const { capacity, equipment, location, limit = 50, offset = 0 } = filters;

  const where: any = {};
  
  if (capacity) {
    where.capacity = { gte: capacity };
  }
  
  if (equipment) {
    where.equipment = { contains: equipment, mode: 'insensitive' };
  }
  
  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }

  const [rooms, total] = await Promise.all([
    prisma.room.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.room.count({ where }),
  ]);

  return {
    items: rooms,
    pagination: {
      limit,
      offset,
      total,
    },
  };
}

export async function getRoomById(id: string) {
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      bookings: {
        where: {
          status: 'ACTIVE',
          endTime: { gte: new Date() },
        },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          purpose: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: { startTime: 'asc' },
      },
    },
  });

  if (!room) {
    throw new NotFoundError('Room');
  }

  return room;
}

export async function createRoom(data: CreateRoomData) {
  const room = await prisma.room.create({
    data,
  });

  return room;
}

export async function updateRoom(id: string, data: UpdateRoomData) {
  // Check if room exists
  const existingRoom = await prisma.room.findUnique({
    where: { id },
  });

  if (!existingRoom) {
    throw new NotFoundError('Room');
  }

  const room = await prisma.room.update({
    where: { id },
    data,
  });

  return room;
}

export async function deleteRoom(id: string) {
  // Check if room exists
  const existingRoom = await prisma.room.findUnique({
    where: { id },
    include: {
      bookings: {
        where: {
          status: 'ACTIVE',
          endTime: { gte: new Date() },
        },
      },
    },
  });

  if (!existingRoom) {
    throw new NotFoundError('Room');
  }

  // Note: With CASCADE delete, bookings will be automatically deleted
  // In a production system, you might want to prevent deletion if there are active bookings
  await prisma.room.delete({
    where: { id },
  });
}

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log('✅ Created admin user:', admin.username);

  // Create teacher user
  const teacherPassword = await bcrypt.hash('Teacher123!', 12);
  const teacher = await prisma.user.upsert({
    where: { username: 'teacher' },
    update: {},
    create: {
      username: 'teacher',
      email: 'teacher@example.com',
      passwordHash: teacherPassword,
      role: Role.TEACHER,
    },
  });
  console.log('✅ Created teacher user:', teacher.username);

  // Create student user
  const studentPassword = await bcrypt.hash('Student123!', 12);
  const student = await prisma.user.upsert({
    where: { username: 'student' },
    update: {},
    create: {
      username: 'student',
      email: 'student@example.com',
      passwordHash: studentPassword,
      role: Role.STUDENT,
    },
  });
  console.log('✅ Created student user:', student.username);

  // Create sample rooms
  const room1 = await prisma.room.upsert({
    where: { name: 'Аудитория 101' },
    update: {},
    create: {
      name: 'Аудитория 101',
      description: 'Большая лекционная аудитория',
      capacity: 50,
      equipment: 'Проектор, доска, микрофон',
      location: 'Корпус А, 1 этаж',
    },
  });
  console.log('✅ Created room:', room1.name);

  const room2 = await prisma.room.upsert({
    where: { name: 'Аудитория 205' },
    update: {},
    create: {
      name: 'Аудитория 205',
      description: 'Компьютерный класс',
      capacity: 20,
      equipment: '20 ПК, проектор, кондиционер',
      location: 'Корпус А, 2 этаж',
    },
  });
  console.log('✅ Created room:', room2.name);

  const room3 = await prisma.room.upsert({
    where: { name: 'Аудитория 310' },
    update: {},
    create: {
      name: 'Аудитория 310',
      description: 'Малая аудитория для семинаров',
      capacity: 15,
      equipment: 'Доска, телевизор',
      location: 'Корпус Б, 3 этаж',
    },
  });
  console.log('✅ Created room:', room3.name);

  // Create a sample booking
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  
  const endTime = new Date(tomorrow);
  endTime.setHours(12, 0, 0, 0);

  const booking = await prisma.booking.upsert({
    where: { id: 'sample-booking-id' },
    update: {},
    create: {
      id: 'sample-booking-id',
      roomId: room1.id,
      userId: teacher.id,
      startTime: tomorrow,
      endTime: endTime,
      purpose: 'Лекция по математике',
    },
  });
  console.log('✅ Created sample booking:', booking.id);

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

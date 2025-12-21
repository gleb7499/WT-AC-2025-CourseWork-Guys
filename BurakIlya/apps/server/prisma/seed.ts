import { PrismaClient } from '@prisma/client';
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
      email: 'admin@helpnearby.com',
      passwordHash: adminPassword,
      role: 'admin',
    },
  });
  console.log('✅ Created admin user');

  // Create regular user
  const userPassword = await bcrypt.hash('User123!', 12);
  const user = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      email: 'user@example.com',
      passwordHash: userPassword,
      role: 'user',
    },
  });
  console.log('✅ Created regular user');

  // Create volunteer users
  const volunteer1Password = await bcrypt.hash('Volunteer123!', 12);
  const volunteer1 = await prisma.user.upsert({
    where: { username: 'volunteer1' },
    update: {},
    create: {
      username: 'volunteer1',
      email: 'volunteer1@example.com',
      passwordHash: volunteer1Password,
      role: 'volunteer',
    },
  });

  const volunteer2Password = await bcrypt.hash('Volunteer123!', 12);
  const volunteer2 = await prisma.user.upsert({
    where: { username: 'volunteer2' },
    update: {},
    create: {
      username: 'volunteer2',
      email: 'volunteer2@example.com',
      passwordHash: volunteer2Password,
      role: 'volunteer',
    },
  });
  console.log('✅ Created volunteer users');

  // Create categories
  const categories = [
    {
      name: 'Доставка продуктов',
      description: 'Помощь в покупке и доставке продуктов питания',
      icon: '🛒',
    },
    {
      name: 'Медицинская помощь',
      description: 'Сопровождение к врачу, помощь с лекарствами',
      icon: '🏥',
    },
    {
      name: 'Бытовая помощь',
      description: 'Помощь по дому, мелкий ремонт',
      icon: '🔧',
    },
    {
      name: 'Образование',
      description: 'Репетиторство, помощь с обучением',
      icon: '📚',
    },
    {
      name: 'Социальная поддержка',
      description: 'Общение, моральная поддержка',
      icon: '💬',
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { id: category.name },
      update: {},
      create: category,
    });
    createdCategories.push(created);
  }
  console.log('✅ Created categories');

  // Create volunteer profiles
  await prisma.volunteerProfile.upsert({
    where: { userId: volunteer1.id },
    update: {},
    create: {
      userId: volunteer1.id,
      bio: 'Опытный волонтёр, готов помочь с доставкой и бытовыми вопросами',
      rating: 4.8,
      totalHelps: 15,
      locationLat: 55.7558,
      locationLng: 37.6173,
      categories: [createdCategories[0].id, createdCategories[2].id],
    },
  });

  await prisma.volunteerProfile.upsert({
    where: { userId: volunteer2.id },
    update: {},
    create: {
      userId: volunteer2.id,
      bio: 'Медицинский работник, помогаю с лекарствами и сопровождением к врачу',
      rating: 5.0,
      totalHelps: 23,
      locationLat: 55.7522,
      locationLng: 37.6156,
      categories: [createdCategories[1].id, createdCategories[4].id],
    },
  });
  console.log('✅ Created volunteer profiles');

  // Create sample help requests
  const request1 = await prisma.helpRequest.create({
    data: {
      userId: user.id,
      categoryId: createdCategories[0].id,
      title: 'Нужна помощь с покупкой продуктов',
      description: 'Нужно купить продукты в ближайшем магазине. Список небольшой.',
      status: 'new',
      locationLat: 55.7558,
      locationLng: 37.6173,
      locationAddress: 'Москва, ул. Тверская, 10',
    },
  });

  const request2 = await prisma.helpRequest.create({
    data: {
      userId: user.id,
      categoryId: createdCategories[1].id,
      title: 'Сопровождение к врачу',
      description: 'Требуется сопровождение на приём к терапевту',
      status: 'new',
      locationLat: 55.7500,
      locationLng: 37.6150,
      locationAddress: 'Москва, ул. Арбат, 25',
    },
  });
  console.log('✅ Created sample help requests');

  // Create an assignment and review for demonstration
  const assignment = await prisma.assignment.create({
    data: {
      requestId: request1.id,
      volunteerId: volunteer1.id,
      status: 'completed',
      completedAt: new Date(),
    },
  });

  await prisma.helpRequest.update({
    where: { id: request1.id },
    data: { status: 'completed' },
  });

  await prisma.review.create({
    data: {
      assignmentId: assignment.id,
      userId: user.id,
      volunteerId: volunteer1.id,
      rating: 5,
      comment: 'Отличная помощь! Волонтёр был очень вежлив и всё доставил вовремя.',
    },
  });
  console.log('✅ Created sample assignment and review');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { db } from './index';
import { users, locations, responsibleLinks, UserRole } from './schema';
import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';

async function seed() {
  try {
    // Limpar tabelas existentes
    await db.delete(locations);
    await db.delete(responsibleLinks);
    await db.delete(users);

    // Criar usuários
    const usersData = await Promise.all(
      Array.from({ length: 10 }, async () => ({
        email: faker.internet.email(),
        password: await hash('password123', 10),
        fullName: faker.person.fullName(),
        role: faker.helpers.arrayElement(Object.values(UserRole)),
        phone: faker.phone.number(),
        isVerified: faker.datatype.boolean(),
        lastLogin: faker.date.recent(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      }))
    );

    const insertedUsers = await db.insert(users).values(usersData).returning();

    // Criar links entre alunos e responsáveis
    const students = insertedUsers.filter(user => user.role === UserRole.STUDENT);
    const parents = insertedUsers.filter(user => user.role === UserRole.PARENT);

    for (const student of students) {
      const parent = faker.helpers.arrayElement(parents);
      await db.insert(responsibleLinks).values({
        studentId: student.id,
        parentId: parent.id,
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      });
    }

    // Criar localizações para cada usuário
    for (const user of insertedUsers) {
      const locationsData = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
        userId: user.id,
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
        accuracy: faker.number.float({ min: 1, max: 100 }).toString(),
        speed: faker.number.float({ min: 0, max: 100 }).toString(),
        heading: faker.number.float({ min: 0, max: 360 }).toString(),
        altitude: faker.number.float({ min: 0, max: 1000 }).toString(),
        timestamp: faker.date.recent(),
      }));

      await db.insert(locations).values(locationsData);
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Executar o seed
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
import { PrismaService } from '@/common/prisma/prisma.service';
import { AppLogger } from '@/common/logger/logger.service';
import * as bcrypt from 'bcrypt';
import { SystemRole } from '@prisma/client';

const prisma = new PrismaService(new AppLogger());

async function main() {
  await prisma.$connect();

  const password = await bcrypt.hash('Admin@123', 10);
  const systemRole = SystemRole.SUPERADMIN;

  await prisma.user.upsert({
    where: {
      email: 'super-admin@test.com',
    },
    update: {},
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'super-admin@test.com',
      systemRole,
      password,
    },
  });

  console.log('Super admin seeded successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { PrismaService } from '@/common/prisma/prisma.service';
import { AppLogger } from '@/common/logger/logger.service';
import { seedAdmin } from './seeders/admin.seeder';
import { seedTags } from './seeders/tags.seeder';
import { seedTechnologies } from './seeders/technologies.seeder';

const prisma = new PrismaService(new AppLogger());

async function main() {
  await prisma.$connect();
  await seedAdmin(prisma);
  await seedTags(prisma);
  await seedTechnologies(prisma);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
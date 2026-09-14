import { PrismaService } from '@/common/prisma/prisma.service';

export async function seedTags(prisma: PrismaService) {
  const tags = ['Frontend', 'Backend', 'Design', 'DevOps'];

  for (const name of tags) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Tags seeded successfully');
}

import * as bcrypt from 'bcrypt';
import { SystemRole } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';

export async function seedAdmin(prisma: PrismaService) {
  const password = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: {
      email: 'super-admin@test.com',
    },
    update: {},
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'super-admin@test.com',
      systemRole: SystemRole.SUPERADMIN,
      password,
    },
  });

  console.log('Super admin seeded successfully');
}

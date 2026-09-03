import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getHealth(): Promise<{ database: string }> {
    await (this.prisma as any).$queryRaw`SELECT 1`;

    return {
      database: 'connected',
    };
  }
}

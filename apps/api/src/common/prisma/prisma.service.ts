import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { adapter } from '@/common/prisma/prisma.adaptor';
import { AppLogger } from '@/common/logger/logger.service'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private logger: AppLogger) {
    super({ adapter });
  }

  async onModuleInit() {
  try {
    await this.$connect();
    this.logger.log('Prisma connected successfully');
  } catch (e) {
      this.logger.error('Prisma connection failed');
      console.log(e)
    throw e;
  }
}

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
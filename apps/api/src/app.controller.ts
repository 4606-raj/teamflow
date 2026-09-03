import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '@/common/logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly logger: AppLogger,
  ) {}

  @Get()
  getHello(): string | undefined {
    this.logger.log('Fetching hello message');
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): Promise<{ database: string }> {
    return this.appService.getHealth();
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from '@/config/app.config';
import databaseConfig from '@/config/database.config';
import jwtConfig from '@/config/jwt.config';
import { LoggerModule } from '@/common/logger/logger.module';
import { envValidationSchema } from '@/config/env.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
      ],
    }),
    LoggerModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

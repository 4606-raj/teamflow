import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from '@/config/app.config';
import databaseConfig from '@/config/database.config';
import jwtConfig from '@/config/jwt.config';
import { envValidationSchema } from '@/config/env.validation';
import { LoggerModule } from '@/common/logger/logger.module';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { InvitationsModule } from './modules/invitations/invitations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    LoggerModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    InvitationsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

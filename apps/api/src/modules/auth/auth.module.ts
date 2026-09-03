import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OrganizationRepository } from '../organizations/repositories/organization.repository';
import { GoogleStrategy } from './strategies/google.strategy';
import { UsersRepository } from '../users/repositories/users.repository';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    OrganizationRepository,
    UsersRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}

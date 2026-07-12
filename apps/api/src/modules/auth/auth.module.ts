import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OrganizationRepository } from '../organizations/repositories/organization.repository';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OrganizationRepository],
  exports: [AuthService]
})
export class AuthModule {}

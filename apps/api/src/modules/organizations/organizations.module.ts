import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationRepository } from './repositories/organization.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [OrganizationsService, OrganizationRepository],
  controllers: [OrganizationsController],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}

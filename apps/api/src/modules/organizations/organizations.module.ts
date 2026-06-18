import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationRepository } from './repositories/organization.repository';

@Module({
  providers: [OrganizationsService, OrganizationRepository],
  controllers: [OrganizationsController]
})
export class OrganizationsModule {}

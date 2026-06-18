import { Injectable, Req } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationRepository } from './repositories/organization.repository';

@Injectable()
export class OrganizationsService {
    constructor(private readonly organizationRepository: OrganizationRepository) {}
    
    create(userId: string, data: CreateOrganizationDto) {
        return this.organizationRepository.createWithMembership(userId, data);
    }
}

import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationRepository } from './repositories/organization.repository';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class OrganizationsService {
    constructor(
        private readonly organizationRepository: OrganizationRepository,
        private readonly authService: AuthService

    ) {}
    
    create(userId: string, data: CreateOrganizationDto) {
        return this.organizationRepository.createWithMembership(userId, data);
    }

    getAllOwn(userId: string) {
        return this.organizationRepository.getAllForUser(userId);
    }

    async switchOrganization(userId: string, email: string, organizationId: string) {
        
        const membership = await this.organizationRepository.findMembership(userId, organizationId);

        if(!membership) {
            throw new ForbiddenException("You are not a member of this organization");
        }

        return this.authService.generateTokens(
            userId,
            email,
            organizationId,
            membership.role
        );
    }
}

import { ConflictException, Injectable } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationsRepository } from './repositories/invitations.repository';
import { InvitationStatus, MembershipRole } from '@prisma/client';
import { OrganizationsService } from '../organizations/organizations.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class InvitationsService {
    constructor(
        public readonly invitationsRepository: InvitationsRepository,
        public readonly organizationService: OrganizationsService,
        public readonly usersService: UsersService
    ) {}

    async create(userId: string, organizationId: string, dto: CreateInvitationDto) {

        const user = await this.usersService.findByEmail(dto.email);

        if (!user) {
            throw new ConflictException('User not found');
        }
        
        if(organizationId == undefined) {
            throw new ConflictException('Organization not found');
        }

        const existingInvitation = await this.invitationsRepository.getByEmail(dto.email);

        if(existingInvitation) {
            throw new ConflictException('Invitation already exists for this email');
        }
        
        const invitation = {
            email: dto.email,
            organizationId: organizationId,
            role: MembershipRole.MEMBER,
            token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // Pending: will replace with helper function
            status: InvitationStatus.PENDING,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
            createdBy: userId,
        }
        
        return this.invitationsRepository.create(invitation);
    }

    getAll(organizationId: string) {
        return this.invitationsRepository.getAll(organizationId);
    }

    async accept(userId: string, token: string) {
        const invitation = await this.invitationsRepository.getByToken(token);

        if(!invitation || invitation.status !== InvitationStatus.PENDING || invitation.expiresAt < new Date()   ) {
            throw new ConflictException('Invitation not found');
        }

        const user = await this.usersService.findById(userId);

        if (!user || user.email !== invitation.email) {
            throw new ConflictException('User not found');
        }

        await this.organizationService.addMember(user.id, invitation.email, invitation.organizationId);
        
        return this.invitationsRepository.accept(invitation.id);
    }

    // Pending: permissions to check user role and if they can delete the invitation
    async delete(id: string) {
        const invitation = await this.invitationsRepository.getByToken(id);

        if(!invitation || invitation.status !== InvitationStatus.PENDING) {
            throw new ConflictException('Invitation not found');
        }

        return this.invitationsRepository.delete(invitation.id);
    }
}

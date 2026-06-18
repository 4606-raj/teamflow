import { PrismaService } from "@/common/prisma/prisma.service";
import { ConflictException, Injectable } from "@nestjs/common";
import { MembershipRole } from "@prisma/client";
import { CreateOrganizationDto } from "../dto/create-organization.dto";

@Injectable()
export class OrganizationRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createWithMembership(userId: string, data: CreateOrganizationDto) {
    
        const exists = await this.prisma.organization.findUnique({
            where: {slug: data.name}
        });

        if(exists) {
            throw new ConflictException("Organization with this name already exists");
        }
        
        const response = this.prisma.organization.create({
            data: {
                name: data.name,
                slug: data.name,
                
                memberships: {
                    create: {
                        userId,
                        role: MembershipRole.OWNER,
                    },
                },
            },
            include: {
                memberships: true,
            },
        });
        
        return response;
    }
}
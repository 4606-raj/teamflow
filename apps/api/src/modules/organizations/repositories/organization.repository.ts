import { PrismaService } from '@/common/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { MembershipRole } from '@prisma/client';
import { CreateOrganizationDto } from '../dto/create-organization.dto';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWithMembership(userId: string, data: CreateOrganizationDto) {
    const exists = await this.prisma.organization.findUnique({
      where: { slug: data.name },
    });

    if (exists) {
      throw new ConflictException('Organization with this name already exists');
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

  async getAllForUser(userId: string) {
    const data = await this.prisma.organization.findMany({
      where: {
        memberships: {
          some: {
            userId,
          },
        },
      },
      include: {
        memberships: {
          where: {
            userId,
          },
          select: {
            role: true,
          },
        },
      },
    });

    return data;
  }

  async findMembership(userId: string, organizationId: string) {
    return this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });
  }

  async findMembershipByUserId(userId: string) {
    return this.prisma.membership.findFirst({
      where: {
        userId: userId,
      },
    });
  }

  async addMemberToOrganization(
    userId: string,
    organizationId: string,
    role: MembershipRole,
  ) {
    return this.prisma.membership.create({
      data: {
        userId,
        organizationId,
        role,
      },
    });
  }
}

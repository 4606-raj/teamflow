import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { InvitationStatus } from '@prisma/client/edge';

@Injectable()
export class InvitationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return await this.prisma.invitation.create({ data });
  }

  async getAll(organizationId: string) {
    return await this.prisma.invitation.findMany({
      where: {
        organizationId: organizationId,
      },
    });
  }

  async getByEmail(email: string) {
    return await this.prisma.invitation.findFirst({
      where: {
        email: email,
      },
    });
  }

  async getByToken(token: string) {
    return await this.prisma.invitation.findFirst({
      where: {
        token: token,
      },
    });
  }

  async accept(id: string) {
    return await this.prisma.invitation.update({
      where: {
        id: id,
      },
      data: {
        status: InvitationStatus.ACCEPTED,
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.invitation.delete({
      where: {
        id: id,
      },
    });
  }
}

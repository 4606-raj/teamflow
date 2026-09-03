import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InvitationStatus, OAuthProvider } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
        invitations: {
          where: {
            status: InvitationStatus.PENDING,
          },
          include: {
            organization: true,
          },
        },
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  create(data: CreateUserDto) {
    const user = this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        systemRole: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }

  updateRefreshToken(userId: string, refreshTokenHash: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  async findByAuthIdentity(provider: OAuthProvider, providerAccountId: string) {
    return this.prisma.user.findFirst({
      where: {
        authIdentities: {
          some: {
            provider,
            providerAccountId,
          },
        },
      },
    });
  }

  async createOAuthUser(data: {
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    provider: OAuthProvider;
    providerAccountId: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: '', // see note below
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        systemRole: 'USER',

        authIdentities: {
          create: {
            provider: data.provider,
            providerAccountId: data.providerAccountId,
          },
        },
      },
      include: {
        authIdentities: true,
      },
    });
  }

  async linkOAuthIdentity(
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      avatar: string | null;
    },
    data: {
      provider: OAuthProvider;
      providerAccountId: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
    },
  ) {
    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstName: user.firstName ?? data.firstName,
        lastName: user.lastName ?? data.lastName,
        avatar: user.avatar ?? data.avatar,

        authIdentities: {
          create: {
            provider: data.provider,
            providerAccountId: data.providerAccountId,
          },
        },
      },
    });
  }

  async updateProfileFromOAuth(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
    },
  ) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
      },
    });
  }
}

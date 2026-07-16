import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        })
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        })
    }

    create(data: CreateUserDto) {
        const user = this.prisma.user.create({
            data,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                systemRole: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        })
        return user;
    }

    updateRefreshToken(userId: string, refreshTokenHash: string | null) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { refreshTokenHash },
        })
    }
}
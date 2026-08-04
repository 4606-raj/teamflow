import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MembershipRole, SystemRole } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { OrganizationRepository } from '../organizations/repositories/organization.repository';
import { Permission } from '@/common/enums/permission.enum';
import { ROLE_PERMISSIONS } from '@/common/rbac/role-permissions';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly organizationRepository: OrganizationRepository
    ) {}

    async register(data: RegisterDto) {
        const user = await this.usersService.create(data);
        const tokens = await this.generateTokens(user.id, user.email);

        // store hashed refresh token in DB
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return { user, tokens };
    }

    async login(data: LoginDto, res: Response) {
        const user = await this.usersService.findByEmail(data.email);

        if(!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const membership = await this.organizationRepository.findMembershipByUserId(user.id);

        const permissions = user.systemRole == SystemRole.SUPERADMIN? ROLE_PERMISSIONS[SystemRole.SUPERADMIN]: membership ? ROLE_PERMISSIONS[membership.role]: undefined;
        
        const tokens = await this.generateTokens(
            user.id,
            user.email,
            membership ? membership.organizationId : undefined,
            membership ? membership.role : undefined,
            permissions,
            user.systemRole
        );


        // store hashed refresh token in DB
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: 'lax',
            path: '/auth/refresh',
        });


        return { user: new UserEntity(user), tokens };
    }

    async logout(userId: string) {
        await this.usersService.updateRefreshToken(userId, null);

        return { message: 'Logged out successfully' };
    }
    
    async getMe(userId: string) {
        const user = await this.usersService.findById(userId);
        
        if(!user) {
            throw new UnauthorizedException('User not found');
        }
        return new UserEntity(user);
    }

    // Generates access and refresh token
    async generateTokens(userId: string, email: string, organizationId?: string, role?: MembershipRole, permissions?: Array<Permission>, systemRole?: SystemRole,) {

        systemRole = systemRole? systemRole: SystemRole.USER;
        
        const payload = {
            sub: userId,
            email,
            organizationId,
            role,
            permissions,
            systemRole,
        }
        
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, { secret: this.configService.get('JWT_ACCESS_SECRET'), expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN') }),
            this.jwtService.signAsync(payload, { secret: this.configService.get('JWT_REFRESH_SECRET'), expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') })
        ])

        return { accessToken, refreshToken};
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.usersService.findById(userId);

        if(!user || !user.refreshTokenHash) {
            throw new UnauthorizedException('Access Denied');
        }

        const refreshMatches = await bcrypt.compare(refreshToken, user.refreshTokenHash);

        if(!refreshMatches) {
            throw new UnauthorizedException('Invalid refresh token')
        }

        const membership = await this.organizationRepository.findMembershipByUserId(user.id);

        const tokens = await this.generateTokens(
            user.id, 
            user.email,
            membership ? membership.organizationId : undefined,
            membership ? membership.role : undefined,
            membership ? ROLE_PERMISSIONS[membership.role]: undefined,
            user.systemRole
        );

        // update hashed refresh token in DB
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }
}

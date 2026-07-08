import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MembershipRole } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async register(data: RegisterDto) {
        const user = await this.usersService.create(data);
        const tokens = await this.generateTokens(user.id, user.email);

        // store hashed refresh token in DB
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return { user, tokens };
    }

    async login(data: LoginDto) {
        const user = await this.usersService.findByEmail(data.email);

        if(!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user.id, user.email);

        // store hashed refresh token in DB
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

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
    async generateTokens(userId: string, email: string, organizationId?: string, role?: MembershipRole) {

        const payload = {
            sub: userId,
            email,
            organizationId,
            role,
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

        const tokens = await this.generateTokens(user.id, user.email);

        // update hashed refresh token in DB
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }
}

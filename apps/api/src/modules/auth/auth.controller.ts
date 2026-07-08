import { Body, Post, Controller, Get, Req, UseGuards, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    @Post('register')
    register(@Body() data: RegisterDto) {
        return this.authService.register(data);
    }

    @Post('login')
    login(@Body() data: LoginDto) {
        return this.authService.login(data);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    logout(@Req() req: any) {
        return this.authService.logout(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Req() req: any) {
        return this.authService.getMe(req.user.userId);
    }

    @Post('refresh')
    async refresh(@Body() dto: {refreshToken: string }) {

        if (!dto || !dto.refreshToken) {
            throw new BadRequestException('Refresh token must be provided in the request body');
        }
        
        try {
            const decoded = await this.jwtService.verifyAsync(dto.refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            }) as any;
            
            if (!decoded || !decoded.sub) {
                throw new UnauthorizedException('Invalid refresh token');
            }
            
            return this.authService.refreshTokens(decoded.sub, dto.refreshToken);
        }
        catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}

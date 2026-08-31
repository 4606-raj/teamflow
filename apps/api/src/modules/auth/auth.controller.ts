import { Body, Post, Controller, Get, Req, UseGuards, UnauthorizedException, BadRequestException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { LoginDto } from './dto/login.dto';
import { type Request, type Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    @Post('register')
    register(@Body() data: RegisterDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.register(data, res);
    }

    @Post('login')
    login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.login(data, res);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        return this.authService.logout(req.user.userId, res);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Req() req: any) {
        return this.authService.getMe(req.user.userId);
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new BadRequestException('Refresh token missing');
        }

        
        try {
            const decoded = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            }) as any;
            
            if (!decoded || !decoded.sub) {
                throw new UnauthorizedException('Invalid refresh token');
            }
            
            return this.authService.refreshTokens(decoded.sub, refreshToken, res);
        }
        catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}

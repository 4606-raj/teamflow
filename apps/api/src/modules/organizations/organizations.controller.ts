import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SwitchOrganizationDto } from './dto/switch-organization.dto';

@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
    constructor(private readonly organizationService: OrganizationsService) {}

    @Post('/')
    create(@Req() req, @Body() data: CreateOrganizationDto) {
        return this.organizationService.create(req.user.userId, data);
    }

    @Get('/')
    getAllOwn(@Req() req) {
        return this.organizationService.getAllOwn(req.user.userId);
    }

    @Post('/switch')
    joinOrganization(@Req() req, @Body() dto: SwitchOrganizationDto) {
        return this.organizationService.switchOrganization(req.user.userId, req.user.email, dto.organizationId);
    }
}

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
    constructor(private readonly organizationService: OrganizationsService) {}

    @Post('/')
    create(@Req() req, @Body() data: CreateOrganizationDto) {
        return this.organizationService.create(req.user.userId, data);
    }
}

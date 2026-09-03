import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SwitchOrganizationDto } from './dto/switch-organization.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { PermissionGuard } from '@/modules/auth/guards/permission.guard';
import { Permission } from '@/common/enums/permission.enum';
import { Permissions } from '@/common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

  // @Permissions(Permission.ORGANIZATION_CREATE)
  @Post('/')
  create(@Req() req, @Body() data: CreateOrganizationDto) {
    return this.organizationService.create(req.user.userId, data);
  }

  @Permissions(Permission.ORGANIZATION_READ_ALL)
  @Get('/')
  getAllOwn(@Req() req) {
    return this.organizationService.getAllOwn(req.user.userId);
  }

  @Post('/switch')
  joinOrganization(@Req() req, @Body() dto: SwitchOrganizationDto) {
    return this.organizationService.switchOrganization(
      req.user.userId,
      req.user.email,
      dto.organizationId,
    );
  }

  @Post('/add-member')
  addMember(
    @Body() data: { userId: string; email: string; organizationId: string },
  ) {
    return this.organizationService.addMember(
      data.userId,
      data.email,
      data.organizationId,
    );
  }
}

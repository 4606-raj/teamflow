import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('invitations')
export class InvitationsController {
  constructor(public readonly invitationsService: InvitationsService) {}

  @Post('/')
  create(@Req() req, @Body() dto: CreateInvitationDto) {
    return this.invitationsService.create(
      req.user.userId,
      req.user.organizationId,
      dto,
    );
  }

  @Get('/')
  getAll(@Req() req) {
    return this.invitationsService.getAll(req.user.organizationId);
  }

  @Get('/accept/:token')
  accept(@Req() req, @Param('token') token: string) {
    return this.invitationsService.accept(req.user.userId, token);
  }

  @Delete('/:token')
  delete(@Param('token') token: string) {
    return this.invitationsService.delete(token);
  }
}

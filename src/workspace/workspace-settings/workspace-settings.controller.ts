import { Controller, Body, Param, Put, Post, UseGuards } from '@nestjs/common';
import { WorkspaceSettingsService } from './workspace-settings.service';
import { UpdateWorkspaceSettingDto } from './dto/update-workspace-setting.dto';
import { PersonDto } from './dto/person.dto';
import { GetUser } from '../../user/decorators/get-user.decorator';
import { User } from '../../user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Workspace } from '../entities/workspace.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('workspace/:id/settings')
export class WorkspaceSettingsController {
  constructor(
    private readonly workspaceSettingsService: WorkspaceSettingsService,
  ) {}

  @Post('invitePerson')
  invitePerson(
    @Body() inviteDto: PersonDto,
    @Param('id') id: string,
    @GetUser('http') user: User,
  ): Promise<User> {
    return this.workspaceSettingsService.invitePerson(inviteDto, id, user);
  }

  @Post('banPerson')
  banPerson(
    @Body() inviteDto: PersonDto,
    @Param('id') id: string,
    @GetUser('http') user: User,
  ): Promise<User> {
    return this.workspaceSettingsService.banPerson(inviteDto, id, user);
  }

  @Put()
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceSettingDto: UpdateWorkspaceSettingDto,
  ): Promise<Workspace> {
    return this.workspaceSettingsService.update(id, updateWorkspaceSettingDto);
  }
}

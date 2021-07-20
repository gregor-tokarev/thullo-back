import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateWorkspaceSettingDto } from './dto/update-workspace-setting.dto';
import { WorkspaceSettingsRepository } from './repositories/workspace-settings.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceRepository } from '../shared/repositories/workspace.repository';
import { Workspace } from '../entities/workspace.entity';
import { UserService } from '../../user/shared/user.service';
import { PersonDto } from './dto/person.dto';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class WorkspaceSettingsService {
  constructor(
    @InjectRepository(WorkspaceSettingsRepository)
    private workspaceSettingsRepository: WorkspaceSettingsRepository,
    @InjectRepository(WorkspaceRepository)
    private workspaceRepository: WorkspaceRepository,
    private userService: UserService,
  ) {}

  async update(
    id: string,
    updateWorkspaceSettingDto: UpdateWorkspaceSettingDto,
  ): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne(id);
    workspace.settings.name = updateWorkspaceSettingDto.name;
    return workspace.save();
  }

  async invitePerson(
    personDto: PersonDto,
    workspaceId: string,
    user: User,
  ): Promise<User> {
    const workspace = await this.workspaceRepository.workspaceDetails(
      workspaceId,
    );
    if (!workspace.isUserPartOfWorkspace(user)) {
      throw new NotFoundException("This workspace doesn't exist");
    }

    const userToInvite = await this.userService.findByEmail(personDto.email);
    if (!userToInvite) {
      throw new NotFoundException("User doesn't exists");
    }

    const isUserExists = workspace.settings.members.find(
      (exUser) => exUser.id === userToInvite.id,
    );
    if (isUserExists) {
      return isUserExists;
    }

    workspace.settings.members.push(userToInvite);
    workspace.publicView();
    await workspace.save();

    userToInvite.publicView();
    return userToInvite;
  }

  async banPerson(
    personDto: PersonDto,
    workspaceId: string,
    user: User,
  ): Promise<User> {
    const workspace = await this.workspaceRepository.workspaceDetails(
      workspaceId,
    );
    const isUserOwner = workspace.isUserOwner(user);
    if (!isUserOwner) {
      throw new BadRequestException('Not owner of workspace');
    }

    const bannedUserIndex = workspace.settings.members.findIndex(
      (member) => member.email === personDto.email,
    );
    if (bannedUserIndex === -1) {
      throw new NotFoundException(
        'User with this email is not a member of workspace',
      );
    }
    const bannedUser = workspace.settings.members[bannedUserIndex];
    workspace.settings.members.splice(bannedUserIndex, 1);
    await workspace.save();

    bannedUser.publicView();
    return bannedUser;
  }
  // async settingsByWorkspaceId(workspaceId): Promise<WorkspaceSettings> {
  //   const workspace = await this.workspaceRepository.findOne({
  //     id: workspaceId,
  //   });
  //   const settingsId = workspace.settings.id;
  //   const settings = await this.workspaceSettingsRepository.findOne({
  //     id: settingsId,
  //   });
  //   return settings;
  // }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspaceRepository } from './shared/repositories/workspace.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { User } from '../user/entities/user.entity';
import { WorkspaceSettings } from './workspace-settings/entities/workspace-setting.entity';
import { WorkspaceSettingsRepository } from './workspace-settings/repositories/workspace-settings.repository';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(WorkspaceRepository)
    private workspaceRepository: WorkspaceRepository,
    @InjectRepository(WorkspaceSettingsRepository)
    private workspaceSettingsRepository: WorkspaceSettingsRepository,
  ) {}

  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    user: User,
  ): Promise<Workspace> {
    const workspace = new Workspace();
    workspace.owner = user;

    const workspaceSettings = new WorkspaceSettings();
    workspaceSettings.name = createWorkspaceDto.name;
    workspaceSettings.members = [user];

    workspace.settings = workspaceSettings;

    return await workspace.save();
  }

  async findAll(user: User): Promise<Workspace[]> {
    return await this.workspaceRepository.find({
      where: { owner: user },
      relations: ['owner'],
    });
  }

  async findOne(id: string, user: User): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id, owner: user },
      relations: ['owner'],
      join: {
        alias: 'workspace',
        leftJoinAndSelect: {
          settings: 'workspace.settings',
          members: 'settings.members',
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace doesn't exist");
    }

    return workspace;
  }

  async getAllUsers(id: string, user: User): Promise<User[]> {
    const workspace = await this.workspaceRepository.workspaceDetails(id);

    const allowRead = workspace.isUserPartOfWorkspace(user);
    if (!allowRead) {
      throw new NotFoundException("Workspace doesn't exists");
    }

    return workspace.settings.members;
  }

  async remove(id: string): Promise<void> {
    const workspace = await this.workspaceRepository.findOne(id);
    await Promise.all([
      this.workspaceRepository.delete(id),
      this.workspaceSettingsRepository.delete(workspace.settings.id),
    ]);
  }
}

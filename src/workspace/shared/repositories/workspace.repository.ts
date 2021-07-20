import { EntityRepository, Repository } from 'typeorm';
import { Workspace } from '../../entities/workspace.entity';
import { User } from '../../../user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Workspace)
export class WorkspaceRepository extends Repository<Workspace> {
  async workspaceDetails(id: string): Promise<Workspace> {
    const workspace = await this.findOne({
      where: { id },
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
      throw new NotFoundException('Workspace is not exists');
    }

    return workspace;
  }

  async findPersonByEmail(id: string, email: string): Promise<User> {
    const workspace = await this.workspaceDetails(id);
    const members = workspace.settings.members;

    const user = members.find((member) => member.email === email);
    if (!user) {
      throw new NotFoundException('User is not part of workspace');
    }

    return user;
  }

  async workspaceDetailsWithUserCheck(
    id: string,
    user: User,
  ): Promise<Workspace> {
    const workspace = await this.workspaceDetails(id);

    const allowRead = workspace.isUserPartOfWorkspace(user);
    if (!allowRead) {
      throw new NotFoundException('Workspace is not exists');
    }

    return workspace;
  }
}

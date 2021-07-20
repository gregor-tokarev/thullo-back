import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  NotFoundException,
} from '@nestjs/common';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';

export function WorkspaceMemberGuard(type: 'ws' | 'http'): CanActivate {
  @Injectable()
  class WorkspaceMemberGuardClass implements CanActivate {
    constructor(
      @InjectRepository(WorkspaceRepository)
      private workspaceRepository: WorkspaceRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const socket = context.switchToWs().getClient<Socket>();
      const request = context.switchToHttp().getRequest();

      const user = type === 'http' ? request.user : socket.handshake.auth.user;
      const workspaceId =
        type === 'http' ? request.params.workspaceId : socket.data.workspaceId;

      const workspace = await this.workspaceRepository.workspaceDetails(
        workspaceId,
      );

      const userPartOfWorkspace = workspace.isUserPartOfWorkspace(user);
      if (!userPartOfWorkspace) {
        type === 'ws' && socket.disconnect();
        throw new NotFoundException('Workspace is not exists');
      }

      return true;
    }
  }

  return mixin(WorkspaceMemberGuardClass) as unknown as CanActivate;
}

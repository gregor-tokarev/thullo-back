import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  NotFoundException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from '../repositories/board.repository';

export function BoardMemberGuard(type: 'ws' | 'http'): CanActivate {
  @Injectable()
  class BoardMemberGuardClass implements CanActivate {
    constructor(
      @InjectRepository(BoardRepository)
      private boardRepository: BoardRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const socket = context.switchToWs().getClient<Socket>();
      const request = context.switchToHttp().getRequest();

      const user = type === 'http' ? request.user : socket.handshake.auth.user;
      const boardId =
        type === 'http'
          ? request.params.boardId
          : socket.handshake.query.boardId;

      const board = await this.boardRepository.boardDetails(boardId);

      const hasAccess = board.isUserPartOfBoard(user);
      if (!hasAccess) {
        type === 'ws' && socket.disconnect();
        throw new NotFoundException('Board is not exists');
      }

      return true;
    }
  }

  return mixin(BoardMemberGuardClass) as unknown as CanActivate;
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { CommentService } from '../services/comment.service';
import { WsException } from '@nestjs/websockets';

export function CommentOwnerGuard(type: 'http' | 'ws'): CanActivate {
  @Injectable()
  class CommentOwnerGuardClass implements CanActivate {
    constructor(private commentService: CommentService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const socket = context.switchToWs().getClient<Socket>();
      const request = context.switchToHttp().getRequest();

      const user = type === 'http' ? request.user : socket.handshake.auth.user;
      const commentId =
        type === 'http' ? request.params.commnetId : socket.data.commentId;

      const comment = await this.commentService.findOne(commentId);
      if (!comment) {
        throw new WsException('Comment is not exists');
      }
      return comment.isUserOwner(user);
    }
  }

  return mixin(CommentOwnerGuardClass) as unknown as CanActivate;
}

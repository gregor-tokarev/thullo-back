import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { CommentService } from './shared/services/comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UseGuards } from '@nestjs/common';
import { AuthSocketGuard } from '../../auth/shared/guards/auth-socket.guard';
import { BoardMemberGuard } from '../../board/shared/guards/board-member.guard';
import { Server, Socket } from 'socket.io';
import { Comment } from './entities/comment.entity';
import { GetUser } from '../../user/decorators/get-user.decorator';
import { User } from '../../user/entities/user.entity';
import { CommentOwnerGuard } from './shared/guards/comment-owner.guard';

@UseGuards(BoardMemberGuard('ws'))
@UseGuards(AuthSocketGuard)
@WebSocketGateway({ namespace: 'task' })
export class CommentGateway {
  constructor(private readonly commentService: CommentService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('createComment')
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody() createCommentDto: CreateCommentDto,
    @GetUser('ws') user: User,
  ): Promise<Comment> {
    const comment = await this.commentService.create(createCommentDto, user);

    const boardId = client.handshake.query.boardId as string;
    this.server.to(boardId).emit('onCreateComment', comment);

    comment.publicView();
    return comment;
  }

  // @UseGuards(CommentOwnerGuard('ws'))
  @SubscribeMessage('updateComment')
  async update(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentService.update(
      updateCommentDto.id,
      updateCommentDto,
    );

    const boardId = client.handshake.query.boardId as string;
    this.server.to(boardId).emit('onUpdateComment', comment);

    return comment;
  }

  @UseGuards(CommentOwnerGuard('ws'))
  @SubscribeMessage('deleteComment')
  async delete(
    @ConnectedSocket() client: Socket,
    @MessageBody('commentId') id: string,
  ): Promise<string> {
    const comment = await this.commentService.delete(id);

    const boardId = client.handshake.query.boardId as string;
    this.server.to(boardId).emit('onDeleteComment', comment);

    return id;
  }
}

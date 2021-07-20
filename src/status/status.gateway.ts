import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { StatusService } from './shared/status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UseGuards } from '@nestjs/common';
import { AuthSocketGuard } from '../auth/shared/guards/auth-socket.guard';
import { BoardMemberGuard } from '../board/shared/guards/board-member.guard';
import { Socket, Server } from 'socket.io';
import { User } from '../user/entities/user.entity';
import { GetUser } from '../user/decorators/get-user.decorator';
import { Status } from './entities/status.entity';

@UseGuards(BoardMemberGuard('ws'))
@UseGuards(AuthSocketGuard)
@WebSocketGateway({ namespace: 'status' })
export class StatusGateway implements OnGatewayConnection {
  constructor(private readonly statusService: StatusService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('createStatus')
  async create(
    @MessageBody() createStatusDto: CreateStatusDto,
    @ConnectedSocket() client: Socket,
    @GetUser('ws') user: User,
  ): Promise<Status> {
    const boardId = client.handshake.query.boardId as string;

    const status = await this.statusService.create(
      createStatusDto,
      user,
      boardId,
    );

    this.server.to(boardId).emit('onCreateStatus', status);

    return status;
  }

  handleConnection(client: Socket): any {
    const boardId = client.handshake.query.boardId;
    client.join(boardId);
  }

  @SubscribeMessage('updateStatus')
  async update(
    @MessageBody() updateStatusDto: UpdateStatusDto,
    @ConnectedSocket() client: Socket,
  ): Promise<Status> {
    const status = await this.statusService.update(
      updateStatusDto.id,
      updateStatusDto,
    );

    const boardId = client.handshake.query.boardId as string;
    this.server.to(boardId).emit('onUpdateStatus', status);

    return status;
  }

  @SubscribeMessage('deleteStatus')
  async remove(
    @ConnectedSocket() client: Socket,
    @MessageBody('statusId') id: string,
  ): Promise<string> {
    await this.statusService.remove(id);

    const boardId = client.handshake.query.boardId as string;
    this.server.to(boardId).emit('onDeleteStatus', id);

    return id;
  }
}

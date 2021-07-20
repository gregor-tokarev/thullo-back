import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { TaskService } from './shared/services/task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Server, Socket } from 'socket.io';
import * as dotenv from 'dotenv';
import { UseGuards } from '@nestjs/common';
import { AuthSocketGuard } from '../auth/shared/guards/auth-socket.guard';
import { BoardMemberGuard } from '../board/shared/guards/board-member.guard';
import { GetUser } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { Task } from './entities/task.entity';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

@UseGuards(BoardMemberGuard('ws'))
@UseGuards(AuthSocketGuard)
@WebSocketGateway({
  namespace: 'task',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class TaskGateway implements OnGatewayConnection {
  constructor(private readonly taskService: TaskService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): any {
    const boardId = client.handshake.query.boardId;
    client.join(boardId);
  }

  @SubscribeMessage('createTask')
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody() createTaskDto: CreateTaskDto,
    @GetUser('ws') user: User,
  ): Promise<Task> {
    const boardId = client.handshake.query.boardId as string;

    const task = await this.taskService.create(createTaskDto, boardId, user);
    task.publicView();

    this.server.to(boardId).emit('onCreateTask', task);

    return task;
  }

  @SubscribeMessage('updateTask')
  async update(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskService.update(updateTaskDto.id, updateTaskDto);

    const boardId = client.handshake.query.boardId as string;
    this.server.to(boardId).emit('onUpdateTask', task);

    return task;
  }

  @SubscribeMessage('deleteTask')
  async remove(
    @ConnectedSocket() client: Socket,
    @MessageBody('taskId') id: string,
  ): Promise<string> {
    await this.taskService.delete(id);

    const boardId = client.handshake.query.boardId as string;
    this.server.to(boardId).emit('onDeleteTask', id);

    return id;
  }
}

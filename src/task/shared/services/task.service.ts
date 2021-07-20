import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { UpdateTaskDto } from '../../dto/update-task.dto';
import { Task } from '../../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusService } from '../../../status/shared/status.service';
import { User } from '../../../user/entities/user.entity';
import { WsException } from '@nestjs/websockets';
import { BoardService } from '../../../board/shared/board.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
    private statusService: StatusService,
    private boardService: BoardService,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    boardId: string,
    user: User,
  ): Promise<Task> {
    const task = new Task();
    task.name = createTaskDto.name;

    task.status = await this.statusService.findOne(createTaskDto.statusId);
    task.board = await this.boardService.findOne(boardId);

    task.owner = user;

    task.labels = [];
    task.comments = [];
    task.assigned = [];

    const savedTask = await task.save();
    delete savedTask.owner;
    delete savedTask.board;
    return savedTask;
  }

  async findOne(id: string): Promise<Task> {
    return await this.taskRepository.findOneOrFail(id);
  }

  async findAll(boardId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { board: boardId as unknown },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOneOrFail(id);
    task.name = updateTaskDto.name ?? task.name;
    task.description = updateTaskDto.description ?? task.description;

    return await task.save();
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await this.taskRepository.delete(id);
    if (deleteResult.affected) {
      throw new WsException('status is not exists');
    }
  }
}

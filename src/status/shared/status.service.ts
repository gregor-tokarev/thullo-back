import { Injectable } from '@nestjs/common';
import { CreateStatusDto } from '../dto/create-status.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusRepository } from './repositories/status.repository';
import { User } from '../../user/entities/user.entity';
import { Status } from '../entities/status.entity';
import { BoardRepository } from '../../board/shared/repositories/board.repository';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(StatusRepository)
    private statusRepository: StatusRepository,
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  async create(
    createStatusDto: CreateStatusDto,
    user: User,
    boardId: string,
  ): Promise<Status> {
    const board = await this.boardRepository.findOne(boardId);

    const status = new Status();
    status.name = createStatusDto.name;
    status.color = createStatusDto.color;
    status.board = board;

    const savedStatus = await status.save();
    delete savedStatus.board;
    return savedStatus;
  }

  async findAll(boardId: string): Promise<Status[]> {
    return await this.statusRepository.find({
      board: boardId as unknown,
    });
  }

  async findOne(id: string): Promise<Status> {
    return await this.statusRepository.findOneOrFail({ id });
  }

  async update(id: string, updateStatusDto: UpdateStatusDto): Promise<Status> {
    const status = await this.statusRepository.findOne(id);
    if (!status) {
      throw new WsException('Status not found');
    }

    status.name = updateStatusDto.name ?? status.name;
    status.color = updateStatusDto.color ?? status.color;

    return await status.save();
  }

  async remove(statusId: string): Promise<void> {
    const deleteResult = await this.statusRepository.delete(statusId);
    if (deleteResult.affected) {
      throw new WsException('status is not exsist');
    }
  }
}

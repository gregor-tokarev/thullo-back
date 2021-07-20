import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { BoardRepository } from './repositories/board.repository';
import { User } from '../../user/entities/user.entity';
import { WorkspaceRepository } from '../../workspace/shared/repositories/workspace.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from '../entities/board.entity';
import { PersonDto } from '../dto/person.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
    @InjectRepository(WorkspaceRepository)
    private workspaceRepository: WorkspaceRepository,
  ) {}

  async create(
    createBoardDto: CreateBoardDto,
    workspaceId: string,
    user: User,
  ): Promise<Board> {
    const workspace = await this.workspaceRepository.workspaceDetails(
      workspaceId,
    );

    const board = new Board();
    board.workspace = workspace;
    board.members = [user];
    board.owner = user;

    board.statuses = [];
    board.labels = [];
    board.visibility = createBoardDto.visibility;

    board.name = createBoardDto.name;
    board.description = createBoardDto.description;

    return await board.save();
  }

  async findAll(workspaceId: string): Promise<Board[]> {
    return await this.boardRepository.find({
      where: { workspace: workspaceId },
    });
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.boardRepository.boardDetails(id);
    if (!board) {
      throw new NotFoundException('Board is not exists');
    }
    return board;
  }

  async update(
    boardId: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    const board = await this.boardRepository.findOne(boardId);
    board.name = updateBoardDto.name ?? board.name;
    board.description = updateBoardDto.description ?? board.description;
    board.visibility = updateBoardDto.visibility ?? board.visibility;

    return await board.save();
  }

  async remove(id: string): Promise<void> {
    const board = await this.boardRepository.delete(id);
    if (!board.affected) {
      throw new NotFoundException("Board doesn't exists");
    }
  }

  async inviteUserFromWorkspace(
    boardId: string,
    workspaceId: string,
    personDto: PersonDto,
  ): Promise<User> {
    const user = await this.workspaceRepository.findPersonByEmail(
      workspaceId,
      personDto.email,
    );

    const board = await this.boardRepository.boardDetails(boardId);
    board.members.push(user);
    await board.save();

    return user;
  }

  async banPerson(boardId: string, personDto: PersonDto): Promise<User> {
    const board = await this.boardRepository.boardDetails(boardId);
    const userIndex = board.members.findIndex(
      (member) => member.email === personDto.email,
    );
    const user = board.members[userIndex];

    if (userIndex === -1) {
      throw new NotFoundException('User is not member of board');
    }
    board.members.splice(userIndex, 1);

    await board.save();
    return user;
  }
}

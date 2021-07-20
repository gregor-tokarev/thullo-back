import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { BoardService } from './shared/board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { WorkspaceMemberGuard } from '../workspace/shared/guards/workspace-member.guard';
import { Board } from './entities/board.entity';
import { PersonDto } from './dto/person.dto';

@UseGuards(WorkspaceMemberGuard('http'))
@UseGuards(AuthGuard('jwt'))
@Controller(':workspaceId/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @Param('workspaceId') workspaceId: string,
    @GetUser('http') user: User,
  ): Promise<Board> {
    const workspace = await this.boardService.create(
      createBoardDto,
      workspaceId,
      user,
    );
    workspace.publicView();

    return workspace;
  }

  @Post(':id/inviteUser')
  async inviteUser(
    @Body() personDto: PersonDto,
    @Param('workspaceId') workspaceId: string,
    @Param('id') boardId: string,
  ): Promise<User> {
    const user = await this.boardService.inviteUserFromWorkspace(
      boardId,
      workspaceId,
      personDto,
    );
    user.publicView();

    return user;
  }

  @Post(':id/banUser')
  async banUser(
    @Body() personDto: PersonDto,
    @Param('id') boardId: string,
  ): Promise<User> {
    const user = await this.boardService.banPerson(boardId, personDto);
    user.publicView();

    return user;
  }

  @Get('all')
  async findAll(@Param('workspaceId') workspaceId: string): Promise<Board[]> {
    const boards = await this.boardService.findAll(workspaceId);
    boards.forEach((board) => board.publicView());

    return boards;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Board> {
    const board = await this.boardService.findOne(id);
    board.publicView();

    return board;
  }

  @Put(':boardId/update')
  update(
    @Param('boardId') boardId: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return this.boardService.update(boardId, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.boardService.remove(id);
  }
}

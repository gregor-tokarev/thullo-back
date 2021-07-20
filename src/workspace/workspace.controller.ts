import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { Workspace } from './entities/workspace.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @GetUser('http') user: User,
  ): Promise<Workspace> {
    const workspace = await this.workspaceService.create(
      createWorkspaceDto,
      user,
    );
    workspace.publicView();
    return workspace;
  }

  @Get()
  async findAll(@GetUser('http') user: User): Promise<Workspace[]> {
    const workspaces = await this.workspaceService.findAll(user);
    workspaces.forEach((workspace) => workspace.publicView());

    return workspaces;
  }

  @Get(':workspaceId/members')
  async getAllMembers(
    @Param('workspaceId') id: string,
    @GetUser('http') user: User,
  ): Promise<User[]> {
    return this.workspaceService.getAllUsers(id, user);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetUser('http') user: User,
  ): Promise<Workspace> {
    const workspace = await this.workspaceService.findOne(id, user);
    workspace.publicView();

    return workspace;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    await this.workspaceService.remove(id);

    return id;
  }
}

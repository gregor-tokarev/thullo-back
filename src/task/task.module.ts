import { Module } from '@nestjs/common';
import { TaskGateway } from './task.gateway';
import { AuthSocketGuard } from '../auth/shared/guards/auth-socket.guard';
import { StatusService } from '../status/shared/status.service';
import { TaskService } from './shared/services/task.service';
import { TaskController } from './task.controller';
import { TaskSharedModule } from './shared/task-shared.module';
import { AuthSharedModule } from '../auth/shared/auth-shared.module';

@Module({
  imports: [AuthSharedModule, TaskSharedModule],
  providers: [TaskGateway, AuthSocketGuard, StatusService, TaskService],
  controllers: [TaskController],
})
export class TaskModule {}

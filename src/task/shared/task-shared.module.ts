import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './repositories/task.repository';
import { TaskService } from './services/task.service';
import { StatusSharedModule } from '../../status/shared/status-shared.module';
import { BoardSharedModule } from '../../board/shared/board-shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    StatusSharedModule,
    BoardSharedModule,
  ],
  providers: [TaskService],
  exports: [TypeOrmModule, TaskService, StatusSharedModule, BoardSharedModule],
})
export class TaskSharedModule {}

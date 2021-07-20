import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceRepository } from './repositories/workspace.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceRepository])],
  exports: [TypeOrmModule],
})
export class WorkspaceSharedModule {}

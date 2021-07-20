import { Module } from '@nestjs/common';
import { WorkspaceSettingsService } from './workspace-settings.service';
import { WorkspaceSettingsController } from './workspace-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceSettingsRepository } from './repositories/workspace-settings.repository';
import { WorkspaceRepository } from '../shared/repositories/workspace.repository';
import { UserSharedModule } from '../../user/shared/user-shared.module';

@Module({
  imports: [
    UserSharedModule,
    TypeOrmModule.forFeature([
      WorkspaceSettingsRepository,
      WorkspaceRepository,
    ]),
  ],
  controllers: [WorkspaceSettingsController],
  providers: [WorkspaceSettingsService],
})
export class WorkspaceSettingsModule {}

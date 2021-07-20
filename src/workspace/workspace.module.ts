import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceSettingsModule } from './workspace-settings/workspace-settings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceSettingsRepository } from './workspace-settings/repositories/workspace-settings.repository';
import { WorkspaceSharedModule } from './shared/workspace-shared.module';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [
    WorkspaceSharedModule,
    WorkspaceSettingsModule,
    TypeOrmModule.forFeature([WorkspaceSettingsRepository]),
  ],
})
export class WorkspaceModule {}

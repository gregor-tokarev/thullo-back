import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceSettingsController } from './workspace-settings.controller';
import { WorkspaceSettingsService } from './workspace-settings.service';

describe('WorkspaceSettingsController', () => {
  let controller: WorkspaceSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceSettingsController],
      providers: [WorkspaceSettingsService],
    }).compile();

    controller = module.get<WorkspaceSettingsController>(
      WorkspaceSettingsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { EntityRepository, Repository } from 'typeorm';
import { WorkspaceSettings } from '../entities/workspace-setting.entity';

@EntityRepository(WorkspaceSettings)
export class WorkspaceSettingsRepository extends Repository<WorkspaceSettings> {}

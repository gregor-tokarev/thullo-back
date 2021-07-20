import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { WorkspaceSettings } from '../workspace-settings/entities/workspace-setting.entity';

@Entity('workspace')
export class Workspace extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  @OneToOne(
    () => WorkspaceSettings,
    (workspaceSettings) => workspaceSettings.id,
    {
      eager: true,
      cascade: true,
    },
  )
  @JoinColumn()
  settings: WorkspaceSettings;

  isUserOwner(user: User): boolean {
    return this.owner.id === user.id || this.owner.email === user.email;
  }

  isUserPartOfWorkspace(user: User): boolean {
    const isMember = this.settings.members.findIndex(
      (member) => member.id === user.id || member.email === user.email,
    );
    return isMember !== -1 || this.isUserOwner(user);
  }

  publicView(): void {
    this.owner?.publicView();
    this.settings?.members?.forEach((user) => user.publicView());
  }
}

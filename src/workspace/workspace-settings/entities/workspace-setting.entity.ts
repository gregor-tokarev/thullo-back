import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from '../../entities/workspace.entity';
import { User } from '../../../user/entities/user.entity';

@Entity('workspace-settings')
export class WorkspaceSettings extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => Workspace, (workspace) => workspace.settings, {
    onDelete: 'CASCADE',
  })
  workspace: Workspace;

  @ManyToMany(() => User, (user) => user.id)
  @JoinTable()
  members: User[];
}

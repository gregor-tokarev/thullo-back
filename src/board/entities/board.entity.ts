import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from '../../workspace/entities/workspace.entity';
import { User } from '../../user/entities/user.entity';
import { Status } from '../../status/entities/status.entity';
import { Label } from '../../label/entities/label.entity';

@Entity('board')
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.id)
  workspace: Workspace;

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @OneToMany(() => Label, (label) => label.board)
  labels: Label[];

  @OneToMany(() => Status, (status) => status.board)
  statuses: Status[];

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  @ManyToMany(() => User, (user) => user.id, { cascade: true })
  @JoinTable()
  members: User[];

  @Column()
  visibility: 'private' | 'public';

  isUserOwner(user: User): boolean {
    return this.owner.id === user.id || this.owner.email === user.email;
  }

  isUserPartOfBoard(user: User): boolean {
    const isMember = this.members.findIndex(
      (member) => member.id === user.id || member.email === user.email,
    );

    return isMember !== -1 || this.isUserOwner(user);
  }

  publicView(): void {
    this.members?.forEach((member) => member.publicView());
    this.owner?.publicView();
    this.workspace?.publicView();
  }
}

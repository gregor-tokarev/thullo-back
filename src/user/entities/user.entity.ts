import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { authMethodType } from '../interfaces/auth-method.interface';
import { Workspace } from '../../workspace/entities/workspace.entity';

const defaultAvatarUrl = 'https://eu.ui-avatars.com/api';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  authMethod: authMethodType;

  @Column({ nullable: true })
  googleAccessToken?: string;

  @Column({ nullable: true })
  facebookAccessToken?: string;

  @Column()
  avatar: string;

  @ManyToMany(() => Workspace, (workspace) => workspace.id)
  @JoinTable()
  workspaces: Workspace[];

  // validatePassword(password: string): Promise<boolean> {
  //   return compare(password, this.password);
  // }

  setDefaultAvatar(): void {
    if (!this.email) {
      throw new Error('user object must have email for seting default avatar');
    }

    const query = new URLSearchParams();
    query.set('name', this.email);
    this.avatar = defaultAvatarUrl + '?' + query.toString();
  }
  publicView(): void {
    this.password = undefined;
    this.googleAccessToken = undefined;
    this.authMethod = undefined;
    this.facebookAccessToken = undefined;
    this.workspaces = undefined;
  }
}

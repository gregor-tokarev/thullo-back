import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { Task } from '../../entities/task.entity';

@Entity('comment')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  @Column()
  text: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => Task, (task) => task.id)
  @JoinColumn()
  task: Task;

  isUserOwner(user: User): boolean {
    return this.owner === user;
  }

  publicView(): void {
    this.owner.publicView();
  }
}

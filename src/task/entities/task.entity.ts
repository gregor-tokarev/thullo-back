import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../comment/entities/comment.entity';
import { Status } from '../../status/entities/status.entity';
import { Label } from '../../label/entities/label.entity';
import { Board } from '../../board/entities/board.entity';

@Entity('task')
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => Status, (status) => status.id)
  @JoinColumn()
  status: Status;

  @ManyToOne(() => Board, (board) => board.id)
  @JoinColumn()
  board: Board;

  @ManyToMany(() => Label, (label) => label.id)
  @JoinTable()
  labels: Label[];

  @OneToMany(() => User, (user) => user.id)
  @JoinColumn()
  assigned: User[];

  @OneToMany(() => Comment, (comment) => comment.task, {
    eager: true,
  })
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  publicView(): void {
    this.owner?.publicView();
    this.assigned?.forEach((user) => user.publicView());
    this.board?.publicView();
  }
}

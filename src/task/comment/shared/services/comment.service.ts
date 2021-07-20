import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { UpdateCommentDto } from '../../dto/update-comment.dto';
import { Comment } from '../../entities/comment.entity';
import { CommentRepository } from '../repositories/comment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../user/entities/user.entity';
import { TaskService } from '../../../shared/services/task.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,

    private taskService: TaskService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = new Comment();
    comment.owner = user;
    comment.text = createCommentDto.text;

    comment.task = await this.taskService.findOne(createCommentDto.taskId);

    const savedComment = await comment.save();
    delete savedComment.task;
    return comment;
  }

  async findOne(id: string): Promise<Comment> {
    return await this.commentRepository.findOneOrFail({
      where: { id },
      relations: ['owner'],
    });
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOneOrFail(id);
    comment.text = updateCommentDto.text;

    return await comment.save();
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await this.commentRepository.delete(id);
    if (deleteResult.affected) {
      throw new WsException('status is not exists');
    }
  }
}

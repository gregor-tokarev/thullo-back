import { Module } from '@nestjs/common';
import { CommentGateway } from './comment.gateway';
import { AuthModule } from '../../auth/auth.module';
import { CommentSharedModule } from './shared/comment-shared.module';

@Module({
  imports: [AuthModule, CommentSharedModule],
  providers: [CommentGateway],
})
export class CommentModule {}

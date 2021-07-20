import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @MaxLength(4000)
  @IsString()
  @IsNotEmpty()
  text: string;
}

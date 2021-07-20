import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @MaxLength(4000)
  @IsNotEmpty()
  text: string;

  @IsUUID()
  @IsNotEmpty()
  taskId: string;
}

import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsIn(['private', 'public'])
  @IsNotEmpty()
  visibility: 'private' | 'public';

  @IsString()
  @IsNotEmpty()
  name: string;

  description?: string;
}

import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateTaskDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(2000)
  @IsString()
  @IsNotEmpty()
  description: string;
}

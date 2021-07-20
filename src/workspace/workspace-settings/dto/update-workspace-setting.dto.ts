import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateWorkspaceSettingDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;
}

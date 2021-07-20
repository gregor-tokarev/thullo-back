import { IsHexColor, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateStatusDto {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsHexColor()
  @IsNotEmpty()
  color: string;
}

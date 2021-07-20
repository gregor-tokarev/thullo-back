import { IsEmail, IsNotEmpty } from 'class-validator';

export class PersonDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

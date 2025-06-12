import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;
}

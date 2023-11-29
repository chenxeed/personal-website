import { OmitType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserInput {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateUserInput extends OmitType(CreateUserInput, [
  'password',
] as const) {}

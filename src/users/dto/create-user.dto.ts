// src/users/dto/create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsEnum(['admin', 'client'])
  role: string;

  @IsNumber()
  @IsOptional()
  clienteId?: number;
}
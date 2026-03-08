// src/users/dto/create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'juan123', description: 'Nombre de usuario único' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'secreto123', description: 'Contraseña del usuario' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: ['admin', 'client'], example: 'client', description: 'Rol del usuario' })
  @IsEnum(['admin', 'client'])
  role: string;

  @ApiPropertyOptional({ example: 5, description: 'ID del cliente asociado (solo para rol client)' })
  @IsNumber()
  @IsOptional()
  clienteId?: number;
}

import { IsString, IsNotEmpty, Length, Matches, IsBoolean, IsOptional, IsEmpty } from 'class-validator';
import { IsNull } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({ example: 'María López', description: 'Nombre completo del cliente', minLength: 1, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nombre: string;

  @ApiProperty({ example: '50212345678', description: 'Número de teléfono (8-20 caracteres)', minLength: 8, maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  telefono: string;

  @ApiProperty({ example: 'Zona 10, Ciudad de Guatemala', description: 'Dirección del cliente' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiPropertyOptional({ example: '1234567890101', description: 'Número de DPI del cliente' })
  @IsString()
  dpi?: string;

  @ApiPropertyOptional({ example: true, description: 'Estado activo del cliente', default: true })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;

}

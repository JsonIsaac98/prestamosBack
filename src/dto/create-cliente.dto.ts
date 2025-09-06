import { IsString, IsNotEmpty, Length, Matches, IsBoolean, IsOptional, IsEmpty } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  telefono: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  dpi?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

}
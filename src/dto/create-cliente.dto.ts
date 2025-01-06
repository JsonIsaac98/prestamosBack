import { IsString, IsNotEmpty, Length, Matches, IsBoolean, IsOptional } from 'class-validator';

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
  @IsNotEmpty()
  @Length(13, 13)
  @Matches(/^[0-9]+$/, { message: 'DPI debe contener solo números' })
  dpi: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

}
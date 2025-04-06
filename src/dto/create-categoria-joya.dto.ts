import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateCategoriaJoyaDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio_gramo: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateInventarioJoyaDto {
  @IsNumber()
  categoria_id: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  gramos_total: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costo_adquisicion: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
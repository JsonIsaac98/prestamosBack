import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateVentaInventarioDto {
  @IsNumber()
  categoria_id: number;

  @IsNumber()
  @Min(0.001)
  gramos: number;

  @IsOptional()
  @IsNumber()
  referencia_id?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
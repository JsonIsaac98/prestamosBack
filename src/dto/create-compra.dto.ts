import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCompraDto {
  @IsNumber()
  categoria_id: number;

  @IsNumber()
  @Min(0.001)
  gramos: number;

  @IsNumber()
  @Min(0)
  costo_total: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
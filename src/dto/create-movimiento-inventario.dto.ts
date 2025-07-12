import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TipoMovimiento } from '../entities/movimiento-inventario.entity';

export class CreateMovimientoInventarioDto {
  @IsNumber()
  categoria_id: number;

  @IsEnum(TipoMovimiento)
  tipo_movimiento: TipoMovimiento;

  @IsNumber()
  @Min(0.001)
  gramos: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costo_unitario?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costo_total?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  referencia_id?: number;
}
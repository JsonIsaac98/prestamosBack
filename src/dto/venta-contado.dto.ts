// src/dto/venta-contado.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { DetalleJoyaDto } from './detalle-joya.dto';

export class CreateVentaContadoDto {
  @IsNumber()
  cliente_id: number;

  @IsNumber()
  @IsOptional()
  credito_id?: number;

  @IsString()
  descripcion_articulo: string;

  @IsNumber()
  precio_venta: number;

  @IsNumber()
  @IsOptional()
  plazo_meses?: number;

  @IsNumber()
  @IsOptional()
  saldo_pendiente?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  tasa_interes?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleJoyaDto)
  detalles_joya: DetalleJoyaDto[];
}
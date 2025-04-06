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

  @IsOptional()
  @IsString()
  comentario?: string;

  @IsNumber()
  @IsOptional()
  plazo_meses?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  tasa_interes?: number;

  //default value is true
  @IsBoolean()
  es_credito: boolean = true;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleJoyaDto)
  detalles_joya: DetalleJoyaDto[];
}
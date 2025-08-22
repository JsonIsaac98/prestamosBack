// src/dto/venta-contado.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { DetalleJoyaDto } from './detalle-joya.dto';

export class CreateVentaContadoDto {
  @IsNumber()
  cliente_id: number;

  @IsString()
  descripcion_articulo: string;

  @IsNumber()
  precio_venta: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleJoyaDto)
  detalles_joya: DetalleJoyaDto[];
}

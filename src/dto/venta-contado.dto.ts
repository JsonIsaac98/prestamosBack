// src/dto/venta-contado.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DetalleJoyaDto } from './detalle-joya.dto';

export class CreateVentaContadoDto {
  @ApiProperty({ example: 2, description: 'ID del cliente que realiza la compra' })
  @IsNumber()
  cliente_id: number;

  @ApiProperty({ example: 'Pulsera de plata', description: 'Descripción del artículo vendido' })
  @IsString()
  descripcion_articulo: string;

  @ApiProperty({ example: 850.00, description: 'Precio de venta al contado' })
  @IsNumber()
  precio_venta: number;

  @ApiProperty({ type: [DetalleJoyaDto], description: 'Joyas incluidas en la venta' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleJoyaDto)
  detalles_joya: DetalleJoyaDto[];
}

import { IsNumber, IsString, IsNotEmpty, Min, IsArray, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DetalleJoyaDto } from './detalle-joya.dto';

export class CreateCreditoConJoyasDto {
  @ApiProperty({ example: 1, description: 'ID del cliente al que se otorga el crédito' })
  @IsNumber()
  @IsNotEmpty()
  cliente_id: number;

  @ApiProperty({ example: 2000.00, description: 'Precio de venta total', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  precio_venta: number;

  @ApiProperty({ example: 1800.00, description: 'Saldo pendiente inicial', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  saldo_pendiente: number;

  @ApiProperty({ example: 'Collar y aretes de oro 18k', description: 'Descripción del artículo en garantía' })
  @IsString()
  @IsNotEmpty()
  descripcion_articulo: string;

  @ApiProperty({ example: 12, description: 'Plazo en meses', minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  plazo_meses: number;

  @ApiProperty({ example: 5.0, description: 'Tasa de interés mensual (%)', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  tasa_interes: number;

  @ApiPropertyOptional({ example: 'Cliente preferencial', description: 'Comentario adicional sobre el crédito' })
  @IsOptional()
  @IsString()
  comentario?: string;

  @ApiProperty({ type: [DetalleJoyaDto], description: 'Lista de joyas incluidas en el crédito' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleJoyaDto)
  detalles_joya: DetalleJoyaDto[];
}

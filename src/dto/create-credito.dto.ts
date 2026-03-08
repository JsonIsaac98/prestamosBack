// src/dto/create-credito.dto.ts
import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCreditoDto {
  @ApiProperty({ example: 1, description: 'ID del cliente al que se otorga el crédito' })
  @IsNumber()
  @IsNotEmpty()
  cliente_id: number;

  @ApiProperty({ example: 'Anillo de oro 18k', description: 'Descripción del artículo en garantía' })
  @IsString()
  @IsNotEmpty()
  descripcion_articulo: string;

  @ApiProperty({ example: 1500.00, description: 'Precio de venta del crédito', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  precio_venta: number;

  @ApiProperty({ example: 6, description: 'Plazo en meses para pagar el crédito', minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  plazo_meses: number;

  @ApiProperty({ example: 5.5, description: 'Tasa de interés mensual (%)', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  tasa_interes: number;
}

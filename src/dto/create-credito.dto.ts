// src/dto/create-credito.dto.ts
import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';

export class CreateCreditoDto {
  @IsNumber()
  @IsNotEmpty()
  cliente_id: number;

  @IsString()
  @IsNotEmpty()
  descripcion_articulo: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  precio_venta: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  plazo_meses: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  tasa_interes: number;
}
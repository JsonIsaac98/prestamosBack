import { IsNumber, Min, IsOptional } from 'class-validator';

export class DetalleJoyaDto {
  @IsNumber()
  inventario_id: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  gramos_vendidos: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio_final?: number; // Precio ajustado manualmente (opcional)
}
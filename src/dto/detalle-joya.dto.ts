import { IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DetalleJoyaDto {
  @ApiProperty({ example: 3, description: 'ID del registro de inventario de joya' })
  @IsNumber()
  inventario_id: number;

  @ApiProperty({ example: 2.500, description: 'Gramos de joya vendidos (mín. 0.001)', minimum: 0.001 })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  gramos_vendidos: number;

  @ApiPropertyOptional({ example: 750.00, description: 'Precio final ajustado manualmente (opcional)', minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio_final?: number; // Precio ajustado manualmente (opcional)
}

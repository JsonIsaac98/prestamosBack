import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventarioJoyaDto {
  @ApiProperty({ example: 1, description: 'ID de la categoría a la que pertenece la joya' })
  @IsNumber()
  categoria_id: number;

  @ApiPropertyOptional({ example: 'Anillo con piedra roja', description: 'Descripción detallada de la joya' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 5.750, description: 'Gramos totales de la joya', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  gramos_total: number;

  @ApiProperty({ example: 2000.00, description: 'Costo de adquisición de la joya', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costo_adquisicion: number;

  @ApiPropertyOptional({ example: true, description: 'Si la joya está activa en inventario', default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

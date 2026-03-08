import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoriaJoyaDto {
  @ApiProperty({ example: 'Oro 18k', description: 'Nombre de la categoría de joya' })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({ example: 'Joyas fabricadas en oro de 18 quilates', description: 'Descripción de la categoría' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 450.00, description: 'Precio por gramo en esta categoría', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio_gramo: number;

  @ApiPropertyOptional({ example: true, description: 'Si la categoría está activa', default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

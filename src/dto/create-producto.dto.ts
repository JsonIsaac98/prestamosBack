import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  precio_base: number;

  @IsString()
  categoria: string;

  @IsString()
  comentario: string;
}

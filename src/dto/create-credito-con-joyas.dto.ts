import { IsNumber, IsString, IsNotEmpty, Min, IsArray, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { DetalleJoyaDto } from './detalle-joya.dto';

export class CreateCreditoConJoyasDto {
  @IsNumber()
  @IsNotEmpty()
  cliente_id: number;

  @IsString()
  @IsNotEmpty()
  descripcion_articulo: string;

  @IsBoolean()
  @IsNotEmpty()
  es_credito: boolean;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  plazo_meses: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  tasa_interes: number;

  @IsOptional()
  @IsString()
  comentario?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleJoyaDto)
  detalles_joya: DetalleJoyaDto[];
}
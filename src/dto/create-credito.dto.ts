import { IsNumber, IsString } from 'class-validator';

export class CreateCreditoDto {
  @IsNumber()
  cliente_id: number;

  @IsNumber()
  producto_id: number;

  @IsNumber()
  monto_total: number;

  @IsNumber()
  numero_cuotas: number;

  @IsNumber()
  valor_cuota: number;

  @IsString()
  descripcion: string;
}
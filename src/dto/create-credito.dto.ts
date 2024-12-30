// src/dto/create-credito.dto.ts
import { IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';

export enum EstadoCredito {
  ACTIVO = 'ACTIVO',
  PENDIENTE = 'PENDIENTE',
  CANCELADO = 'CANCELADO'
}

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

  @IsOptional()
  @IsEnum(EstadoCredito)
  estado?: EstadoCredito;
}
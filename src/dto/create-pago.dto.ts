import { IsNumber, IsString, IsEnum, IsOptional, Min, IsNotEmpty } from 'class-validator';

export class CreatePagoDto {
  @IsNumber()
  @IsNotEmpty()
  credito_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  monto: number;

  @IsEnum(['EFECTIVO', 'TRANSFERENCIA'])
  tipo_pago: 'EFECTIVO' | 'TRANSFERENCIA';

  @IsString()
  @IsOptional()
  comentario?: string;
// ALTER TABLE `pagos` 
// ADD COLUMN `estado` ENUM('ACTIVO', 'ANULADO') DEFAULT 'ACTIVO';

  @IsEnum(['ACTIVO', 'ANULADO'])
  @IsOptional()
  estado?: 'ACTIVO' | 'ANULADO';
  
}
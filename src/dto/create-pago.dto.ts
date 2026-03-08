import { IsNumber, IsString, IsEnum, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePagoDto {
  @ApiProperty({ example: 5, description: 'ID del crédito al que pertenece el pago' })
  @IsNumber()
  @IsNotEmpty()
  credito_id: number;

  @ApiProperty({ example: 350.00, description: 'Monto del pago', minimum: 0 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  monto: number;

  @ApiProperty({ enum: ['EFECTIVO', 'TRANSFERENCIA'], example: 'EFECTIVO', description: 'Tipo de pago' })
  @IsEnum(['EFECTIVO', 'TRANSFERENCIA'])
  tipo_pago: 'EFECTIVO' | 'TRANSFERENCIA';

  @ApiPropertyOptional({ example: 'Pago de cuota de enero', description: 'Comentario opcional sobre el pago' })
  @IsString()
  @IsOptional()
  comentario?: string;
// ALTER TABLE `pagos`
// ADD COLUMN `estado` ENUM('ACTIVO', 'ANULADO') DEFAULT 'ACTIVO';

  @ApiPropertyOptional({ enum: ['ACTIVO', 'ANULADO'], example: 'ACTIVO', description: 'Estado del pago' })
  @IsEnum(['ACTIVO', 'ANULADO'])
  @IsOptional()
  estado?: 'ACTIVO' | 'ANULADO';

}

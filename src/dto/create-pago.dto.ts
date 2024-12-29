import { IsNumber, IsString } from 'class-validator';

export class CreatePagoDto {
  @IsNumber()
  credito_id: number;

  @IsNumber()
  monto: number;

  @IsString()
  comentario: string;
}
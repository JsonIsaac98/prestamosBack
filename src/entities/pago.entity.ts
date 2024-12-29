import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Credito } from './credito.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Credito, credito => credito.pagos)
  credito: Credito;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_pago: Date;

  @Column('text')
  comentario: string;
}
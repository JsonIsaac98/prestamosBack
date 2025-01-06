// pago.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Credito } from './credito.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  credito_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_pago: Date;

  @Column({
    type: 'enum',
    enum: ['EFECTIVO', 'TRANSFERENCIA']
  })
  tipo_pago: 'EFECTIVO' | 'TRANSFERENCIA';

  @Column('text', { nullable: true })
  comentario: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVO', 'ANULADO'],
    default: 'ACTIVO'
  })
  estado: 'ACTIVO' | 'ANULADO';

  @ManyToOne(() => Credito, credito => credito.pagos)
  @JoinColumn({ name: 'credito_id' })
  credito: Credito;
}
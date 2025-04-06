// credito.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { Pago } from './pago.entity';
import { DetalleCreditoJoya } from './detalle-credito-joya.entity';

@Entity('creditos')
export class Credito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cliente_id: number;

  @Column('text')
  descripcion_articulo: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_venta: number;

  @Column()
  plazo_meses: number;

  @Column('decimal', { precision: 10, scale: 2 })
  saldo_pendiente: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_credito: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_ultimo_pago: Date;

  @Column({
    type: 'enum',
    enum: ['ACTIVO', 'PAGADO', 'ATRASADO'],
    default: 'ACTIVO'
  })
  estado: 'ACTIVO' | 'PAGADO' | 'ATRASADO';

  @Column('decimal', { precision: 5, scale: 2 })
  tasa_interes: number;

  @ManyToOne(() => Cliente, cliente => cliente.creditos)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @OneToMany(() => Pago, pago => pago.credito)
  pagos: Pago[];

  @OneToMany(() => DetalleCreditoJoya, detalle => detalle.credito)
detalles_joya: DetalleCreditoJoya[];
}
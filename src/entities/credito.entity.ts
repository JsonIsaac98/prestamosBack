import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Cliente } from './cliente.entity';
import { Producto } from './producto.entity';
import { Pago } from './pago.entity';

@Entity('creditos')
export class Credito {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, cliente => cliente.creditos)
  cliente: Cliente;

  @ManyToOne(() => Producto, producto => producto.creditos)
  producto: Producto;

  @Column('decimal', { precision: 10, scale: 2 })
  monto_total: number;

  @Column()
  numero_cuotas: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valor_cuota: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_credito: Date;

  @Column({ default: 'ACTIVO' })
  estado: string;

  @Column('text')
  descripcion: string;

  @OneToMany(() => Pago, pago => pago.credito)
  pagos: Pago[];
}
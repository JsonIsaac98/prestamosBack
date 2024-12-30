// src/entities/credito.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { Producto } from './producto.entity';
import { Pago } from './pago.entity';

@Entity('creditos')
export class Credito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  monto_total: number;

  @Column()
  numero_cuotas: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valor_cuota: number;

  @Column()
  descripcion: string;

  @Column()
  clienteId: number;

  @Column()
  productoId: number;

  @CreateDateColumn()
  fecha_credito: Date;

  @Column({ default: 'ACTIVO' })
  estado: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'productoId' })
  producto: Producto;

  @OneToMany(() => Pago, pago => pago.credito)
  pagos: Pago[];
}
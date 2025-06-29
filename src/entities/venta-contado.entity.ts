// src/entities/venta-contado.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { DetalleCreditoJoya } from './detalle-credito-joya.entity';

@Entity('ventas')
export class VentaContado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cliente_id: number;

  @Column({ nullable: true })
  credito_id: number;

  @Column('text')
  descripcion_articulo: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_venta: number;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_venta: Date;

  @Column('text', { nullable: true })
  comentario: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @OneToMany(() => DetalleCreditoJoya, detalle => detalle.credito)
  detalles_joya: DetalleCreditoJoya[];
}
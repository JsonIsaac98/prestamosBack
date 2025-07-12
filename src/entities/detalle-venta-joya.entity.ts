// src/entities/detalle-venta-joya.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { VentaContado } from './venta-contado.entity';
import { InventarioJoya } from './inventario-joya.entity';

@Entity('detalle_venta_joyas')
export class DetalleVentaJoya {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venta_id: number;

  @Column()
  inventario_id: number;

  @Column({ type: 'decimal', precision: 8, scale: 3 })
  gramos_vendidos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_venta_gramo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal_calculado: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal_final: number;

  @CreateDateColumn()
  created_at: Date;

  // Relaciones
  @ManyToOne(() => VentaContado, venta => venta.detalles_joya, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venta_id' })
  venta: VentaContado;

  @ManyToOne(() => InventarioJoya, { eager: true })
  @JoinColumn({ name: 'inventario_id' })
  inventario: InventarioJoya;
}
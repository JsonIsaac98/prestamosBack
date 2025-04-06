// src/entities/inventario-joya.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CategoriaJoya } from './categoria-joya.entity';
import { DetalleCreditoJoya } from './detalle-credito-joya.entity';

@Entity('inventario_joyas')
export class InventarioJoya {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoria_id: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  gramos_total: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  gramos_disponible: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_ingreso: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_adquisicion: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;

  @ManyToOne(() => CategoriaJoya, categoria => categoria.inventarios)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaJoya;

  @OneToMany(() => DetalleCreditoJoya, detalle => detalle.inventario)
  detalles_credito: DetalleCreditoJoya[];
}
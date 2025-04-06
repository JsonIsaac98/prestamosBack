import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Credito } from './credito.entity';
import { InventarioJoya } from './inventario-joya.entity';

@Entity('detalle_credito_joyas')
export class DetalleCreditoJoya {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  credito_id: number;

  @Column()
  inventario_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  gramos_vendidos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_venta_gramo: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    comment: 'Precio calculado matemáticamente'
  })
  subtotal_calculado: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    comment: 'Precio final después del ajuste manual'
  })
  subtotal_final: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Credito, credito => credito.detalles_joya)
  @JoinColumn({ name: 'credito_id' })
  credito: Credito;

  @ManyToOne(() => InventarioJoya, inventario => inventario.detalles_credito)
  @JoinColumn({ name: 'inventario_id' })
  inventario: InventarioJoya;
}
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { CategoriaJoya } from './categoria-joya.entity';
  
  export enum TipoMovimiento {
    COMPRA = 'COMPRA',
    VENTA = 'VENTA',
    AJUSTE = 'AJUSTE',
  }
  
  @Entity('movimientos_inventario')
  export class MovimientoInventario {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    categoria_id: number;
  
    @Column({
      type: 'enum',
      enum: TipoMovimiento,
    })
    tipo_movimiento: TipoMovimiento;
  
    @Column('decimal', { precision: 10, scale: 3 })
    gramos: number;
  
    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    costo_unitario: number;
  
    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    costo_total: number;
  
    @Column('text', { nullable: true })
    descripcion: string;
  
    @Column({ nullable: true })
    referencia_id: number; // ID del crédito/venta relacionada
  
    @CreateDateColumn()
    created_at: Date;
  
    @ManyToOne(() => CategoriaJoya)
    @JoinColumn({ name: 'categoria_id' })
    categoria: CategoriaJoya;
  }
  
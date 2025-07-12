import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
  } from 'typeorm';
  import { CategoriaJoya } from './categoria-joya.entity';
  
  @Entity('inventario_stock')
  export class InventarioStock {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    categoria_id: number;
  
    @Column('decimal', { precision: 10, scale: 3, default: 0 })
    gramos_total: number;
  
    @Column('decimal', { precision: 10, scale: 3, default: 0 })
    gramos_disponible: number;
  
    @Column('decimal', { precision: 10, scale: 3, default: 0 })
    gramos_vendido: number;
  
    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    costo_promedio: number;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @OneToOne(() => CategoriaJoya)
    @JoinColumn({ name: 'categoria_id' })
    categoria: CategoriaJoya;
  }
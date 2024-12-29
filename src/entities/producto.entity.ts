import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Credito } from './credito.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_base: number;

  @Column()
  categoria: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Credito, credito => credito.producto)
  creditos: Credito[];
}
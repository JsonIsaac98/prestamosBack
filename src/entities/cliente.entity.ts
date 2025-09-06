import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Credito } from './credito.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 20 })
  telefono: string;

  @Column('text')
  direccion: string;

  @Column({ length: 13, unique: false })
  dpi: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  saldo_total: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_registro: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @OneToMany(() => Credito, credito => credito.cliente)
  creditos: Credito[];
}
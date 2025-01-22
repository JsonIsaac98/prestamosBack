// src/users/entities/user.entity.ts
import { Cliente } from 'src/entities/cliente.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'client'],
    default: 'client',
  })
  role: string;

  @Column({
    name: 'is_first_login',
    type: 'boolean',
    default: true,
  })
  isFirstLogin: boolean;

  @Column({
    name: 'cliente_id',
    nullable: true,
  })
  clienteId: number;

  @OneToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({
    name: 'password_reset_token',
    length: 255,
    nullable: true,
  })
  passwordResetToken: string;

  @Column({
    name: 'password_reset_expires',
    type: 'timestamp',
    nullable: true,
  })
  passwordResetExpires: Date;

  @Column({
    name: 'last_login',
    type: 'timestamp',
    nullable: true,
  })
  lastLogin: Date;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    type: 'tinyint',
    default: 1,
  })
  active: boolean;
}

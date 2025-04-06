// src/creditos/creditos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditosService } from './creditos.service';
import { CreditosController } from './creditos.controller';
import { Credito } from '../entities/credito.entity';
import { Cliente } from '../entities/cliente.entity';
import { DetalleCreditoJoya } from '../entities/detalle-credito-joya.entity';
import { InventarioModule } from '../inventario/inventario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Credito, Cliente, DetalleCreditoJoya]),
    InventarioModule, // Importar el módulo de inventario para usar su servicio 
  ],
  controllers: [CreditosController],
  providers: [CreditosService],
  exports: [CreditosService],
})
export class CreditosModule {}
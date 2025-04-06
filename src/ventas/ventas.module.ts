// src/ventas/ventas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';
import { VentaContado } from '../entities/venta-contado.entity';
import { Cliente } from '../entities/cliente.entity';
import { DetalleCreditoJoya } from '../entities/detalle-credito-joya.entity';
import { InventarioModule } from '../inventario/inventario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VentaContado, Cliente, DetalleCreditoJoya]),
    InventarioModule,
  ],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService],
})
export class VentasModule {}
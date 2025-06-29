// src/ventas/ventas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasController } from './ventas.controller';
import { Cliente } from '../entities/cliente.entity';
import { DetalleCreditoJoya } from '../entities/detalle-credito-joya.entity';
import { InventarioModule } from '../inventario/inventario.module';
import { VentaContado } from 'src/entities/venta-contado.entity';
import { VentasService } from './ventas.service';

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
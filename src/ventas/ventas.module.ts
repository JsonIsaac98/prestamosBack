// src/ventas/ventas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { VentaContado } from '../entities/venta-contado.entity';
import { DetalleVentaJoya } from '../entities/detalle-venta-joya.entity';
import { Credito } from '../entities/credito.entity';
import { DetalleCreditoJoya } from '../entities/detalle-credito-joya.entity';
import { InventarioJoya } from '../entities/inventario-joya.entity';
import { MovimientoInventario } from '../entities/movimiento-inventario.entity';
import { Cliente } from 'src/entities/cliente.entity';
import { InventarioModule } from 'src/inventario/inventario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VentaContado,
      Cliente,                // 🔹 agrega este
      DetalleCreditoJoya,
      DetalleVentaJoya,       // si lo usas en el service también inclúyelo
      Credito,
      InventarioJoya,
      MovimientoInventario,
    ]),
    InventarioModule,
  ],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService],
})
export class VentasModule {}

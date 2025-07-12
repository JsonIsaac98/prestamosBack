// src/inventario/inventario.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { CategoriaJoya } from '../entities/categoria-joya.entity';
import { InventarioJoya } from '../entities/inventario-joya.entity';
import { InventarioStock } from '../entities/inventario-stock.entity';
import { MovimientoInventario } from '../entities/movimiento-inventario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoriaJoya,
      InventarioJoya,
      InventarioStock,
      MovimientoInventario,
    ]),
  ],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports: [InventarioService],
})
export class InventarioModule {}
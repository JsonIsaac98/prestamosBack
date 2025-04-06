import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { CategoriaJoya } from '../entities/categoria-joya.entity';
import { InventarioJoya } from '../entities/inventario-joya.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoriaJoya,
      InventarioJoya
    ]),
  ],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports: [InventarioService],
})
export class InventarioModule {}
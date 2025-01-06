import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Cliente } from '../entities/cliente.entity';
import { Credito } from '../entities/credito.entity';
import { Pago } from '../entities/pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Credito, Pago])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
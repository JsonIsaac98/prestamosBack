import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Cliente } from '../entities/cliente.entity';
import { Credito } from '../entities/credito.entity';
import { Pago } from '../entities/pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Credito, Pago])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
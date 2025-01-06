import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { Pago } from '../entities/pago.entity';
import { Credito } from '../entities/credito.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago, Credito])
  ],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService]
})
export class PagosModule {}
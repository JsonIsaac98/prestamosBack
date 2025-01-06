import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditosController } from './creditos.controller';
import { CreditosService } from './creditos.service';
import { Credito } from '../entities/credito.entity';
import { Cliente } from '../entities/cliente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Credito, Cliente])
  ],
  controllers: [CreditosController],
  providers: [CreditosService],
  exports: [CreditosService]
})
export class CreditosModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { Cliente } from '../entities/cliente.entity';
import { Credito } from '../entities/credito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Credito])],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClientesModule {}
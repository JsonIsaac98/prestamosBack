import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditosController } from './creditos.controller';
import { CreditosService } from './creditos.service';
import { Credito } from '../entities/credito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Credito])],
  controllers: [CreditosController],
  providers: [CreditosService],
  exports: [CreditosService]
})
export class CreditosModule {}

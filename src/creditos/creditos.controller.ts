import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreditosService } from './creditos.service';
import { CreateCreditoDto } from '../dto/create-credito.dto';

@Controller('creditos')
export class CreditosController {
  constructor(private readonly creditosService: CreditosService) {}

  @Post()
  create(@Body() createCreditoDto: CreateCreditoDto) {
    return this.creditosService.create(createCreditoDto);
  }

  @Get()
  findAll() {
    return this.creditosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditosService.findOne(+id);
  }

  @Get(':id/saldo')
  getSaldoPendiente(@Param('id') id: string) {
    return this.creditosService.getSaldoPendiente(+id);
  }
}
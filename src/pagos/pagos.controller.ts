import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from '../dto/create-pago.dto';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagosService.create(createPagoDto);
  }

  @Get()
  findAll() {
    return this.pagosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagosService.findOne(+id);
  }

  @Get('credito/:id')
  findByCredito(@Param('id') id: string) {
    return this.pagosService.findByCredito(+id);
  }
}
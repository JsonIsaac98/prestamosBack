import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from '../dto/create-pago.dto';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Get('credito/:creditoId')
  findByCreditoId(@Param('creditoId') creditoId: string) {
    return this.pagosService.findByCreditoId(+creditoId);
  }

  @Post()
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagosService.create(createPagoDto);
  }

  @Put(':id/anular')
  async anularPago(@Param('id') id: string) {
    return this.pagosService.anularPago(+id);
  }
}
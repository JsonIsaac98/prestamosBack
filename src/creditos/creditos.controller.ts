import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { CreditosService } from './creditos.service';
import { CreateCreditoDto } from '../dto/create-credito.dto';

@Controller('creditos')
export class CreditosController {
  constructor(private readonly creditosService: CreditosService) {}

  @Get()
  findAll(@Query('estado') estado?: 'ACTIVO' | 'PAGADO' | 'ATRASADO') {
    return this.creditosService.findAll(estado);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditosService.findOne(+id);
  }

  @Get('cliente/:clienteId')
  findByCliente(@Param('clienteId') clienteId: string) {
    return this.creditosService.findByCliente(+clienteId);
  }

  @Post()
  create(@Body() createCreditoDto: CreateCreditoDto) {
    return this.creditosService.create(createCreditoDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCreditoDto: CreateCreditoDto,
  ){
    return this.creditosService.update(+id, updateCreditoDto);
  }
}
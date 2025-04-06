// src/creditos/creditos.controller.ts
import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { CreditosService } from './creditos.service';
import { CreateCreditoDto } from '../dto/create-credito.dto';
import { CreateCreditoConJoyasDto } from '../dto/create-credito-con-joyas.dto';
import { DetalleJoyaDto } from '../dto/detalle-joya.dto';

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

  // Mantener el endpoint antiguo para compatibilidad
  @Post()
  create(@Body() createCreditoDto: CreateCreditoDto) {
    return this.creditosService.create(createCreditoDto);
  }

  // Nuevo endpoint para crear crédito con joyas
  @Post('con-joyas')
  createConJoyas(@Body() createCreditoConJoyasDto: CreateCreditoConJoyasDto) {
    return this.creditosService.createConJoyas(createCreditoConJoyasDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCreditoDto: CreateCreditoDto,
  ){
    return this.creditosService.update(+id, updateCreditoDto);
  }

  // Endpoints para gestionar detalles de joyas en créditos existentes
  @Get(':id/detalles-joya')
  getDetallesJoya(@Param('id') id: string) {
    return this.creditosService.getDetallesJoya(+id);
  }

  @Post(':id/detalles-joya')
  agregarDetalleJoya(
    @Param('id') id: string,
    @Body() detalleJoyaDto: DetalleJoyaDto,
  ) {
    return this.creditosService.agregarDetalleJoya(+id, detalleJoyaDto);
  }
}
// src/creditos/creditos.controller.ts
import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreditosService } from './creditos.service';
import { CreateCreditoDto } from '../dto/create-credito.dto';
import { CreateCreditoConJoyasDto } from '../dto/create-credito-con-joyas.dto';
import { DetalleJoyaDto } from '../dto/detalle-joya.dto';

@ApiTags('Creditos')
@Controller('creditos')
export class CreditosController {
  constructor(private readonly creditosService: CreditosService) {}

  @ApiOperation({ summary: 'Listar créditos', description: 'Retorna todos los créditos. Filtra por estado si se provee el query param.' })
  @ApiQuery({ name: 'estado', required: false, enum: ['ACTIVO', 'PAGADO', 'ATRASADO'], description: 'Filtrar por estado del crédito' })
  @ApiResponse({ status: 200, description: 'Lista de créditos.' })
  @Get()
  findAll(@Query('estado') estado?: 'ACTIVO' | 'PAGADO' | 'ATRASADO') {
    return this.creditosService.findAll(estado);
  }

  @ApiOperation({ summary: 'Obtener crédito por ID' })
  @ApiParam({ name: 'id', description: 'ID del crédito', example: 1 })
  @ApiResponse({ status: 200, description: 'Datos del crédito.' })
  @ApiResponse({ status: 404, description: 'Crédito no encontrado.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditosService.findOne(+id);
  }

  @ApiOperation({ summary: 'Créditos por cliente' })
  @ApiParam({ name: 'clienteId', description: 'ID del cliente', example: 1 })
  @ApiResponse({ status: 200, description: 'Lista de créditos del cliente.' })
  @Get('cliente/:clienteId')
  findByCliente(@Param('clienteId') clienteId: string) {
    return this.creditosService.findByCliente(+clienteId);
  }

  // Mantener el endpoint antiguo para compatibilidad
  @ApiOperation({ summary: 'Crear crédito simple', description: 'Crea un crédito sin detalles de joyas.' })
  @ApiResponse({ status: 201, description: 'Crédito creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post()
  create(@Body() createCreditoDto: CreateCreditoDto) {
    return this.creditosService.create(createCreditoDto);
  }

  // Nuevo endpoint para crear crédito con joyas
  @ApiOperation({ summary: 'Crear crédito con joyas', description: 'Crea un crédito incluyendo el detalle de las joyas en garantía.' })
  @ApiResponse({ status: 201, description: 'Crédito con joyas creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post('con-joyas')
  createConJoyas(@Body() createCreditoConJoyasDto: CreateCreditoConJoyasDto) {
    return this.creditosService.createConJoyas(createCreditoConJoyasDto);
  }

  @ApiOperation({ summary: 'Actualizar crédito' })
  @ApiParam({ name: 'id', description: 'ID del crédito a actualizar', example: 1 })
  @ApiResponse({ status: 200, description: 'Crédito actualizado.' })
  @ApiResponse({ status: 404, description: 'Crédito no encontrado.' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCreditoDto: CreateCreditoDto,
  ){
    return this.creditosService.update(+id, updateCreditoDto);
  }

  // Endpoints para gestionar detalles de joyas en créditos existentes
  @ApiOperation({ summary: 'Ver detalles de joyas del crédito' })
  @ApiParam({ name: 'id', description: 'ID del crédito', example: 1 })
  @ApiResponse({ status: 200, description: 'Lista de detalles de joyas del crédito.' })
  @Get(':id/detalles-joya')
  getDetallesJoya(@Param('id') id: string) {
    return this.creditosService.getDetallesJoya(+id);
  }

  @ApiOperation({ summary: 'Agregar detalle de joya a crédito existente' })
  @ApiParam({ name: 'id', description: 'ID del crédito', example: 1 })
  @ApiResponse({ status: 201, description: 'Detalle de joya agregado.' })
  @ApiResponse({ status: 404, description: 'Crédito no encontrado.' })
  @Post(':id/detalles-joya')
  agregarDetalleJoya(
    @Param('id') id: string,
    @Body() detalleJoyaDto: DetalleJoyaDto,
  ) {
    return this.creditosService.agregarDetalleJoya(+id, detalleJoyaDto);
  }
}

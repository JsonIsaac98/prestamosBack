// src/ventas/ventas.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaContadoDto } from 'src/dto/venta-contado.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateCreditoConJoyasDto } from '../dto/create-credito-con-joyas.dto';

@ApiTags('Ventas')
@ApiBearerAuth('JWT')
@Controller('ventas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @ApiOperation({ summary: 'Listar ventas al contado', description: 'Retorna todas las ventas al contado. Solo admin.' })
  @ApiResponse({ status: 200, description: 'Lista de ventas al contado.' })
  @ApiResponse({ status: 403, description: 'Forbidden: se requiere rol admin.' })
  @Get('contado')
  @Roles('admin')
  findAll() {
    return this.ventasService.findAll();
  }

  @ApiOperation({ summary: 'Obtener venta al contado por ID' })
  @ApiParam({ name: 'id', description: 'ID de la venta', example: 1 })
  @ApiResponse({ status: 200, description: 'Datos de la venta.' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada.' })
  @Get('contado/:id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }

  @ApiOperation({ summary: 'Ventas al contado por cliente' })
  @ApiParam({ name: 'clienteId', description: 'ID del cliente', example: 2 })
  @ApiResponse({ status: 200, description: 'Lista de ventas al contado del cliente.' })
  @Get('contado/cliente/:clienteId')
  findByCliente(@Param('clienteId') clienteId: string) {
    return this.ventasService.findByCliente(+clienteId);
  }

  @ApiOperation({ summary: 'Registrar venta al contado', description: 'Crea una nueva venta al contado con detalle de joyas.' })
  @ApiResponse({ status: 201, description: 'Venta al contado creada.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post('contado')
  createContado(@Body() dto: CreateVentaContadoDto) {
    return this.ventasService.createVentaContado(dto);
  }

  @ApiOperation({ summary: 'Registrar venta a crédito', description: 'Crea una nueva venta a crédito con detalle de joyas.' })
  @ApiResponse({ status: 201, description: 'Venta a crédito creada.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post('credito')
  createCredito(@Body() dto: CreateCreditoConJoyasDto) {
    return this.ventasService.createVentaCredito(dto);
  }
}

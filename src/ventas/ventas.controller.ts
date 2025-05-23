// src/ventas/ventas.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaContadoDto } from 'src/dto/venta-contado.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('ventas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Get('contado')
  @Roles('admin')
  findAll() {
    return this.ventasService.findAll();
  }

  @Get('contado/:id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }

  @Get('contado/cliente/:clienteId')
  findByCliente(@Param('clienteId') clienteId: string) {
    return this.ventasService.findByCliente(+clienteId);
  }

  @Post('contado')
  @Roles('admin')
  create(@Body() createVentaDto: CreateVentaContadoDto) {
    return this.ventasService.create(createVentaDto);
  }
}
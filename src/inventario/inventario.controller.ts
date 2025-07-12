// src/inventario/inventario.controller.ts
import { Controller, Get, Post, Body, Param, Put, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateCategoriaJoyaDto } from '../dto/create-categoria-joya.dto';
import { CreateInventarioJoyaDto } from '../dto/create-inventario-joya.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventario')
// @UseGuards(JwtAuthGuard)
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  // === CATEGORÍAS ===
  @Get('categorias')
  getAllCategorias() {
    return this.inventarioService.getAllCategorias();
  }

  @Get('categorias/:id')
  getCategoriaById(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.getCategoriaById(id);
  }

  @Post('categorias')
  createCategoria(@Body() createCategoriaDto: CreateCategoriaJoyaDto) {
    return this.inventarioService.createCategoria(createCategoriaDto);
  }

  @Put('categorias/:id')
  updateCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoriaDto: Partial<CreateCategoriaJoyaDto>,
  ) {
    return this.inventarioService.updateCategoria(id, updateCategoriaDto);
  }

  // === ENDPOINTS ESPECÍFICOS PARA EL DASHBOARD (ANTES DE LAS RUTAS CON PARÁMETROS) ===
  @Get('stock')
  getStock() {
    return this.inventarioService.getStock();
  }

  @Get('movimientos')
  getMovimientos(
    @Query('categoria_id') categoriaId?: number,
    @Query('limit') limit?: number,
  ) {
    return this.inventarioService.getMovimientos(categoriaId, limit);
  }

  @Get('verificar-stock')
  verificarStockDisponible(
    @Query('categoria_id', ParseIntPipe) categoriaId: number,
    @Query('gramos_requeridos') gramosRequeridos: number,
  ) {
    return this.inventarioService.verificarStockDisponible(categoriaId, gramosRequeridos);
  }

  @Get('estadisticas')
  getEstadisticas() {
    return this.inventarioService.getEstadisticas();
  }

  @Get('estadisticas/categorias')
  getEstadisticasPorCategoria() {
    return this.inventarioService.getEstadisticasPorCategoria();
  }

  // === INVENTARIO GENERAL (RUTAS CON PARÁMETROS AL FINAL) ===
  @Get()
  getAllInventario() {
    return this.inventarioService.getAllInventario();
  }

  @Get(':id')
  getInventarioById(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.getInventarioById(id);
  }

  @Post()
  createInventario(@Body() createInventarioDto: CreateInventarioJoyaDto) {
    return this.inventarioService.createInventario(createInventarioDto);
  }

  @Put(':id')
  updateInventario(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventarioDto: Partial<CreateInventarioJoyaDto>,
  ) {
    return this.inventarioService.updateInventario(id, updateInventarioDto);
  }
}
// src/inventario/inventario.controller.ts
import { Controller, Get, Post, Body, Param, Put, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InventarioService } from './inventario.service';
import { CreateCategoriaJoyaDto } from '../dto/create-categoria-joya.dto';
import { CreateInventarioJoyaDto } from '../dto/create-inventario-joya.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Inventario')
@Controller('inventario')
// @UseGuards(JwtAuthGuard)
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  // === CATEGORÍAS ===
  @ApiOperation({ summary: 'Listar categorías de joyas' })
  @ApiResponse({ status: 200, description: 'Lista de categorías.' })
  @Get('categorias')
  getAllCategorias() {
    return this.inventarioService.getAllCategorias();
  }

  @ApiOperation({ summary: 'Obtener categoría por ID' })
  @ApiParam({ name: 'id', description: 'ID de la categoría', example: 1 })
  @ApiResponse({ status: 200, description: 'Datos de la categoría.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  @Get('categorias/:id')
  getCategoriaById(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.getCategoriaById(id);
  }

  @ApiOperation({ summary: 'Crear categoría de joya' })
  @ApiResponse({ status: 201, description: 'Categoría creada.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post('categorias')
  createCategoria(@Body() createCategoriaDto: CreateCategoriaJoyaDto) {
    return this.inventarioService.createCategoria(createCategoriaDto);
  }

  @ApiOperation({ summary: 'Actualizar categoría de joya' })
  @ApiParam({ name: 'id', description: 'ID de la categoría', example: 1 })
  @ApiResponse({ status: 200, description: 'Categoría actualizada.' })
  @Put('categorias/:id')
  updateCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoriaDto: Partial<CreateCategoriaJoyaDto>,
  ) {
    return this.inventarioService.updateCategoria(id, updateCategoriaDto);
  }

  // === ENDPOINTS ESPECÍFICOS PARA EL DASHBOARD (ANTES DE LAS RUTAS CON PARÁMETROS) ===
  @ApiOperation({ summary: 'Ver stock actual', description: 'Retorna el resumen de stock disponible por categoría.' })
  @ApiResponse({ status: 200, description: 'Resumen de stock.' })
  @Get('stock')
  getStock() {
    return this.inventarioService.getStock();
  }

  @ApiOperation({ summary: 'Ver movimientos de inventario', description: 'Lista los movimientos de inventario. Se puede filtrar por categoría y limitar cantidad.' })
  @ApiQuery({ name: 'categoria_id', required: false, description: 'Filtrar por ID de categoría', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Límite de registros a retornar', example: 20 })
  @ApiResponse({ status: 200, description: 'Lista de movimientos.' })
  @Get('movimientos')
  getMovimientos(
    @Query('categoria_id') categoriaId?: number,
    @Query('limit') limit?: number,
  ) {
    return this.inventarioService.getMovimientos(categoriaId, limit);
  }

  @ApiOperation({ summary: 'Verificar stock disponible', description: 'Verifica si hay suficiente stock en gramos para una categoría.' })
  @ApiQuery({ name: 'categoria_id', required: true, description: 'ID de la categoría', example: 1 })
  @ApiQuery({ name: 'gramos_requeridos', required: true, description: 'Gramos que se requieren', example: 3.5 })
  @ApiResponse({ status: 200, description: 'Resultado de verificación de stock.' })
  @Get('verificar-stock')
  verificarStockDisponible(
    @Query('categoria_id', ParseIntPipe) categoriaId: number,
    @Query('gramos_requeridos') gramosRequeridos: number,
  ) {
    return this.inventarioService.verificarStockDisponible(categoriaId, gramosRequeridos);
  }

  @ApiOperation({ summary: 'Estadísticas generales del inventario' })
  @ApiResponse({ status: 200, description: 'Estadísticas del inventario.' })
  @Get('estadisticas')
  getEstadisticas() {
    return this.inventarioService.getEstadisticas();
  }

  @ApiOperation({ summary: 'Estadísticas de inventario por categoría' })
  @ApiResponse({ status: 200, description: 'Estadísticas agrupadas por categoría.' })
  @Get('estadisticas/categorias')
  getEstadisticasPorCategoria() {
    return this.inventarioService.getEstadisticasPorCategoria();
  }

  // === INVENTARIO GENERAL (RUTAS CON PARÁMETROS AL FINAL) ===
  @ApiOperation({ summary: 'Listar todo el inventario de joyas' })
  @ApiResponse({ status: 200, description: 'Lista completa del inventario.' })
  @Get()
  getAllInventario() {
    return this.inventarioService.getAllInventario();
  }

  @ApiOperation({ summary: 'Obtener joya del inventario por ID' })
  @ApiParam({ name: 'id', description: 'ID del registro de inventario', example: 1 })
  @ApiResponse({ status: 200, description: 'Datos de la joya.' })
  @ApiResponse({ status: 404, description: 'Joya no encontrada.' })
  @Get(':id')
  getInventarioById(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.getInventarioById(id);
  }

  @ApiOperation({ summary: 'Agregar joya al inventario' })
  @ApiResponse({ status: 201, description: 'Joya agregada al inventario.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post()
  createInventario(@Body() createInventarioDto: CreateInventarioJoyaDto) {
    return this.inventarioService.createInventario(createInventarioDto);
  }

  @ApiOperation({ summary: 'Actualizar joya del inventario' })
  @ApiParam({ name: 'id', description: 'ID del registro de inventario', example: 1 })
  @ApiResponse({ status: 200, description: 'Inventario actualizado.' })
  @Put(':id')
  updateInventario(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventarioDto: Partial<CreateInventarioJoyaDto>,
  ) {
    return this.inventarioService.updateInventario(id, updateInventarioDto);
  }
}

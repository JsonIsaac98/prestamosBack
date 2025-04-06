import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateCategoriaJoyaDto } from '../dto/create-categoria-joya.dto';
import { CreateInventarioJoyaDto } from '../dto/create-inventario-joya.dto';
// Importa cualquier guardia de autenticación que estés usando
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventario')
// @UseGuards(JwtAuthGuard) // Descomentar si usas autenticación
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  // Endpoints para categorías
  @Get('categorias')
  getAllCategorias() {
    return this.inventarioService.getAllCategorias();
  }

  @Get('categorias/:id')
  getCategoriaById(@Param('id') id: string) {
    return this.inventarioService.getCategoriaById(+id);
  }

  @Post('categorias')
  createCategoria(@Body() createCategoriaDto: CreateCategoriaJoyaDto) {
    return this.inventarioService.createCategoria(createCategoriaDto);
  }

  @Put('categorias/:id')
  updateCategoria(
    @Param('id') id: string,
    @Body() updateCategoriaDto: CreateCategoriaJoyaDto,
  ) {
    return this.inventarioService.updateCategoria(+id, updateCategoriaDto);
  }

  // Endpoints para inventario
  @Get()
  getAllInventario() {
    return this.inventarioService.getAllInventario();
  }

  @Get(':id')
  getInventarioById(@Param('id') id: string) {
    return this.inventarioService.getInventarioById(+id);
  }

  @Post()
  createInventario(@Body() createInventarioDto: CreateInventarioJoyaDto) {
    return this.inventarioService.createInventario(createInventarioDto);
  }

  @Put(':id')
  updateInventario(
    @Param('id') id: string,
    @Body() updateInventarioDto: CreateInventarioJoyaDto,
  ) {
    return this.inventarioService.updateInventario(+id, updateInventarioDto);
  }
}
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { Cliente } from '../entities/cliente.entity';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de todos los clientes.' })
  @Get()
  findAll(): Promise<Cliente[]> {
    return this.clientesService.findAll();
  }

  @ApiOperation({ summary: 'Listar clientes activos' })
  @ApiResponse({ status: 200, description: 'Lista de clientes con estado activo.' })
  @Get('activos')
  findAllIsActive(): Promise<Cliente[]> {
    return this.clientesService.findAllIsActive();
  }

  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID del cliente', example: 1 })
  @ApiResponse({ status: 200, description: 'Datos del cliente.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cliente> {
    return this.clientesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Resumen del cliente', description: 'Retorna créditos, pagos y estadísticas del cliente.' })
  @ApiParam({ name: 'id', description: 'ID del cliente', example: 1 })
  @ApiResponse({ status: 200, description: 'Resumen financiero del cliente.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  @Get(':id/resumen')
  getResumen(@Param('id') id: string) {
    return this.clientesService.getResumenCliente(+id);
  }

  @ApiOperation({ summary: 'Crear cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post()
  create(@Body() createClienteDto: CreateClienteDto): Promise<Cliente> {
    return this.clientesService.create(createClienteDto);
  }

  @ApiOperation({ summary: 'Actualizar cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente a actualizar', example: 1 })
  @ApiResponse({ status: 200, description: 'Cliente actualizado.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateClienteDto: Partial<CreateClienteDto>,
  ): Promise<Cliente> {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @ApiOperation({ summary: 'Eliminar cliente (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID del cliente a desactivar', example: 1 })
  @ApiResponse({ status: 200, description: 'Cliente desactivado.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.clientesService.softDelete(+id);
  }
}

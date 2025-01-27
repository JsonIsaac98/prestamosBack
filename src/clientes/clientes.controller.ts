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
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { Cliente } from '../entities/cliente.entity';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  findAll(): Promise<Cliente[]> {
    return this.clientesService.findAll();
  }

  @Get('activos')
  findAllIsActive(): Promise<Cliente[]> {
    return this.clientesService.findAllIsActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cliente> {
    return this.clientesService.findOne(+id);
  }

  @Get(':id/resumen')
  getResumen(@Param('id') id: string) {
    return this.clientesService.getResumenCliente(+id);
  }

  @Post()
  create(@Body() createClienteDto: CreateClienteDto): Promise<Cliente> {
    return this.clientesService.create(createClienteDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateClienteDto: Partial<CreateClienteDto>,
  ): Promise<Cliente> {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.clientesService.softDelete(+id);
  }
}
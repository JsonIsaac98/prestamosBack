import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from '../dto/create-pago.dto';

@ApiTags('Pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @ApiOperation({ summary: 'Pagos por crédito', description: 'Retorna todos los pagos registrados para un crédito.' })
  @ApiParam({ name: 'creditoId', description: 'ID del crédito', example: 3 })
  @ApiResponse({ status: 200, description: 'Lista de pagos del crédito.' })
  @Get('credito/:creditoId')
  findByCreditoId(@Param('creditoId') creditoId: string) {
    return this.pagosService.findByCreditoId(+creditoId);
  }

  @ApiOperation({ summary: 'Registrar pago', description: 'Registra un nuevo pago para un crédito.' })
  @ApiResponse({ status: 201, description: 'Pago registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post()
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagosService.create(createPagoDto);
  }

  @ApiOperation({ summary: 'Anular pago', description: 'Cambia el estado de un pago a ANULADO.' })
  @ApiParam({ name: 'id', description: 'ID del pago a anular', example: 10 })
  @ApiResponse({ status: 200, description: 'Pago anulado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado.' })
  @Put(':id/anular')
  async anularPago(@Param('id') id: string) {
    return this.pagosService.anularPago(+id);
  }
}

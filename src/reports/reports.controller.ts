// reports.controller.ts
import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Reporte de pagos por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', required: true, description: 'Fecha de inicio (YYYY-MM-DD)', example: '2025-01-01' })
  @ApiQuery({ name: 'fechaFin', required: true, description: 'Fecha de fin (YYYY-MM-DD)', example: '2025-12-31' })
  @ApiResponse({ status: 200, description: 'Reporte de pagos en el rango indicado.' })
  @Get('pagos')
  getReportePagos(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.reportsService.getReportePagos(
      new Date(fechaInicio),
      new Date(fechaFin)
    );
  }

  @ApiOperation({ summary: 'Reporte de clientes morosos', description: 'Lista los clientes con créditos en estado ATRASADO.' })
  @ApiResponse({ status: 200, description: 'Lista de clientes morosos.' })
  @Get('morosos')
  getReporteMorosos() {
    return this.reportsService.getReporteMorosos();
  }

  @ApiOperation({ summary: 'Balance de cliente por rango de fechas', description: 'Retorna el balance financiero de un cliente en un período.' })
  @ApiQuery({ name: 'clienteId', required: true, description: 'ID del cliente', example: 1 })
  @ApiQuery({ name: 'fechaInicio', required: true, description: 'Fecha de inicio (YYYY-MM-DD)', example: '2025-01-01' })
  @ApiQuery({ name: 'fechaFin', required: true, description: 'Fecha de fin (YYYY-MM-DD)', example: '2025-12-31' })
  @ApiResponse({ status: 200, description: 'Balance del cliente en el período indicado.' })
  @Get('balance-cliente')
  getBalanceCliente(
    @Query('clienteId', ParseIntPipe) clienteId: number,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.reportsService.getBalanceCliente(
      clienteId,
      new Date(fechaInicio),
      new Date(fechaFin)
    );
  }
}

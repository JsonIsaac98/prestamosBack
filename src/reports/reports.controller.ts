// reports.controller.ts
import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

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

  @Get('morosos')
  getReporteMorosos() {
    return this.reportsService.getReporteMorosos();
  }

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
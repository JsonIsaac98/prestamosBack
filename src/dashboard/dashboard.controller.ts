// dashboard.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Estadísticas del dashboard', description: 'Retorna conteos y métricas generales: clientes, créditos activos, pagos del mes, etc.' })
  @ApiResponse({ status: 200, description: 'Estadísticas generales del sistema.' })
  @Get('stats')
  getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }

  @ApiOperation({ summary: 'Créditos próximos a vencer', description: 'Retorna créditos cuya fecha de vencimiento está próxima.' })
  @ApiResponse({ status: 200, description: 'Lista de créditos próximos a vencer.' })
  @Get('proximos-vencer')
  getCreditosProximosVencer() {
    return this.dashboardService.getCreditosProximosVencer();
  }
}

// dashboard.controller.ts
import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }

  @Get('proximos-vencer')
  getCreditosProximosVencer() {
    return this.dashboardService.getCreditosProximosVencer();
  }
}
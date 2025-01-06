import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credito } from '../entities/credito.entity';
import { Cliente } from '../entities/cliente.entity';
import { Pago } from '../entities/pago.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Credito)
    private creditosRepository: Repository<Credito>,
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
    @InjectRepository(Pago)
    private pagosRepository: Repository<Pago>,
  ) {}

  async getDashboardStats() {
    const totalClientes = await this.clientesRepository.count({ where: { activo: true } });
    
    const creditosStats = await this.creditosRepository
      .createQueryBuilder('credito')
      .select([
        'COUNT(*) as total_creditos',
        'SUM(saldo_pendiente) as total_pendiente',
        'COUNT(CASE WHEN estado = "ATRASADO" THEN 1 END) as creditos_atrasados',
        'COUNT(CASE WHEN estado = "ACTIVO" THEN 1 END) as creditos_activos',
      ])
      .getRawOne();

    const pagosHoy = await this.pagosRepository
      .createQueryBuilder('pago')
      .where('DATE(pago.fecha_pago) = CURDATE()')
      .select('SUM(monto)', 'total')
      .getRawOne();

    return {
      clientes_activos: totalClientes,
      total_creditos: Number(creditosStats.total_creditos),
      saldo_pendiente_total: Number(creditosStats.total_pendiente),
      creditos_atrasados: Number(creditosStats.creditos_atrasados),
      creditos_activos: Number(creditosStats.creditos_activos),
      pagos_hoy: Number(pagosHoy.total) || 0
    };
  }

  async getCreditosProximosVencer() {
    return this.creditosRepository
      .createQueryBuilder('credito')
      .innerJoinAndSelect('credito.cliente', 'cliente')
      .where('credito.estado = :estado', { estado: 'ACTIVO' })
      .andWhere('credito.fecha_credito <= DATE_SUB(NOW(), INTERVAL (credito.plazo_meses - 1) MONTH)')
      .orderBy('credito.fecha_credito', 'ASC')
      .getMany();
  }
}
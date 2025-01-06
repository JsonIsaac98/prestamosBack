// reports.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Credito } from '../entities/credito.entity';
import { Pago } from '../entities/pago.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Credito)
    private creditosRepository: Repository<Credito>,
    @InjectRepository(Pago)
    private pagosRepository: Repository<Pago>,
  ) {}

  async getReportePagos(fechaInicio: Date, fechaFin: Date) {
    return this.pagosRepository
      .createQueryBuilder('pago')
      .innerJoinAndSelect('pago.credito', 'credito')
      .innerJoinAndSelect('credito.cliente', 'cliente')
      .where('pago.fecha_pago BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin
      })
      .orderBy('pago.fecha_pago', 'DESC')
      .getMany();
  }

  async getReporteMorosos() {
    return this.creditosRepository
      .createQueryBuilder('credito')
      .innerJoinAndSelect('credito.cliente', 'cliente')
      .where('credito.estado = :estado', { estado: 'ATRASADO' })
      .orderBy('credito.fecha_ultimo_pago', 'ASC')
      .getMany();
  }

  async getBalanceCliente(clienteId: number, fechaInicio: Date, fechaFin: Date) {
    const creditos = await this.creditosRepository.find({
      where: { 
        cliente_id: clienteId,
        fecha_credito: Between(fechaInicio, fechaFin)
      },
      relations: ['pagos']
    });

    const pagos = await this.pagosRepository
      .createQueryBuilder('pago')
      .innerJoin('pago.credito', 'credito')
      .where('credito.cliente_id = :clienteId', { clienteId })
      .andWhere('pago.fecha_pago BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin
      })
      .getMany();

    return {
      creditos,
      pagos,
      resumen: {
        total_creditos: creditos.reduce((sum, c) => sum + Number(c.precio_venta), 0),
        total_pagado: pagos.reduce((sum, p) => sum + Number(p.monto), 0)
      }
    };
  }
}
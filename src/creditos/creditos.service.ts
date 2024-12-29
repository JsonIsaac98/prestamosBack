import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credito } from '../entities/credito.entity';
import { CreateCreditoDto } from '../dto/create-credito.dto';

@Injectable()
export class CreditosService {
  constructor(
    @InjectRepository(Credito)
    private creditosRepository: Repository<Credito>,
  ) {}

  async create(createCreditoDto: CreateCreditoDto): Promise<Credito> {
    const credito = this.creditosRepository.create({
      ...createCreditoDto,
      cliente: { id: createCreditoDto.cliente_id },
      producto: { id: createCreditoDto.producto_id }
    });
    return this.creditosRepository.save(credito);
  }

  findAll(): Promise<Credito[]> {
    return this.creditosRepository.find({
      relations: ['cliente', 'producto', 'pagos']
    });
  }

  async findOne(id: number): Promise<Credito> {
    const credito = await this.creditosRepository.findOne({
      where: { id },
      relations: ['cliente', 'producto', 'pagos']
    });
    if (!credito) {
      throw new NotFoundException(`Crédito #${id} no encontrado`);
    }
    return credito;
  }

  async getSaldoPendiente(id: number): Promise<any> {
    const credito = await this.creditosRepository.findOne({
      where: { id },
      relations: ['pagos']
    });

    if (!credito) {
      throw new NotFoundException(`Crédito #${id} no encontrado`);
    }

    const totalPagado = credito.pagos.reduce((sum, pago) => sum + Number(pago.monto), 0);
    const saldoPendiente = Number(credito.monto_total) - totalPagado;

    return {
      credito_id: credito.id,
      monto_total: credito.monto_total,
      total_pagado: totalPagado,
      saldo_pendiente: saldoPendiente,
      numero_cuotas: credito.numero_cuotas,
      cuotas_pagadas: credito.pagos.length,
      cuotas_pendientes: credito.numero_cuotas - credito.pagos.length
    };
  }
}
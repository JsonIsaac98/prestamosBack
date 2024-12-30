// src/creditos/creditos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credito } from '../entities/credito.entity';
import { CreateCreditoDto } from '../dto/create-credito.dto';

export enum EstadoCredito {
  ACTIVO = 'ACTIVO',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADO = 'COMPLETADO',
  VENCIDO = 'VENCIDO',
  CANCELADO = 'CANCELADO'
}

@Injectable()
export class CreditosService {
  constructor(
    @InjectRepository(Credito)
    private creditosRepository: Repository<Credito>,
  ) {}

  async updateCreditoStatus(id: number): Promise<void> {
    const credito = await this.findOne(id);
    const saldoInfo = await this.getSaldoPendiente(id);

    // Determinar el estado basado en los pagos
    if (saldoInfo.total_pagado === 0) {
      credito.estado = EstadoCredito.ACTIVO;
    } else if (saldoInfo.saldo_pendiente <= 0) {
      credito.estado = EstadoCredito.COMPLETADO;
    } else if (saldoInfo.total_pagado > 0) {
      credito.estado = EstadoCredito.EN_PROCESO;
    }

    // Verificar si está vencido (si implementas fechas límite)
    // if (credito.fecha_vencimiento < new Date() && credito.estado !== EstadoCredito.COMPLETADO) {
    //   credito.estado = EstadoCredito.VENCIDO;
    // }

    await this.creditosRepository.save(credito);
  }

  async create(createCreditoDto: CreateCreditoDto): Promise<Credito> {
    const credito = this.creditosRepository.create({
      monto_total: createCreditoDto.monto_total,
      numero_cuotas: createCreditoDto.numero_cuotas,
      valor_cuota: createCreditoDto.valor_cuota,
      descripcion: createCreditoDto.descripcion,
      clienteId: createCreditoDto.cliente_id,
      productoId: createCreditoDto.producto_id,
      estado: 'ACTIVO'
    });

    return this.creditosRepository.save(credito);
  }

  findAll(): Promise<Credito[]> {
    return this.creditosRepository.find({
      relations: ['cliente', 'producto', 'pagos'],
      order: {
        id: 'DESC'
      }
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

  async update(id: number, updateCreditoDto: Partial<CreateCreditoDto>): Promise<Credito> {
    const credito = await this.creditosRepository.findOne({
      where: { id }
    });

    if (!credito) {
      throw new NotFoundException(`Crédito #${id} no encontrado`);
    }

    // Actualizar campos básicos
    if (updateCreditoDto.monto_total !== undefined) {
      credito.monto_total = updateCreditoDto.monto_total;
    }
    if (updateCreditoDto.numero_cuotas !== undefined) {
      credito.numero_cuotas = updateCreditoDto.numero_cuotas;
    }
    if (updateCreditoDto.valor_cuota !== undefined) {
      credito.valor_cuota = updateCreditoDto.valor_cuota;
    }
    if (updateCreditoDto.descripcion !== undefined) {
      credito.descripcion = updateCreditoDto.descripcion;
    }
    
    // Actualizar relaciones si se proporcionan
    if (updateCreditoDto.cliente_id !== undefined) {
      credito.clienteId = updateCreditoDto.cliente_id;
    }
    if (updateCreditoDto.producto_id !== undefined) {
      credito.productoId = updateCreditoDto.producto_id;
    }

    // Guardar los cambios
    await this.creditosRepository.save(credito);

    // Retornar el crédito actualizado con sus relaciones
    return this.creditosRepository.findOne({
      where: { id },
      relations: ['cliente', 'producto', 'pagos']
    });
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

  async remove(id: number): Promise<void> {
    const credito = await this.creditosRepository.findOne({
      where: { id }
    });
    
    if (!credito) {
      throw new NotFoundException(`Crédito #${id} no encontrado`);
    }
    
    await this.creditosRepository.remove(credito);
  }
}
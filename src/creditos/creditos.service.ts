import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credito } from '../entities/credito.entity';
import { Cliente } from '../entities/cliente.entity';
import { CreateCreditoDto } from '../dto/create-credito.dto';

@Injectable()
export class CreditosService {
  constructor(
    @InjectRepository(Credito)
    private creditosRepository: Repository<Credito>,
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
  ) {}

  async findAll(estado?: 'ACTIVO' | 'PAGADO' | 'ATRASADO') {
    const where = estado ? { estado } : {};
    return this.creditosRepository.find({
      where,
      relations: ['cliente', 'pagos'],
      order: { fecha_credito: 'DESC' }
    });
  }

  async findOne(id: number) {
    const credito = await this.creditosRepository.findOne({
      where: { id },
      relations: ['cliente', 'pagos']
    });
    if (!credito) {
      throw new NotFoundException(`Crédito #${id} no encontrado`);
    }
    return credito;
  }

  async findByCliente(clienteId: number) {
    return this.creditosRepository.find({
      where: { cliente_id: clienteId },
      relations: ['pagos'],
      order: { fecha_credito: 'DESC' }
    });
  }

  async create(createCreditoDto: CreateCreditoDto) {
    const cliente = await this.clientesRepository.findOne({
      where: { id: createCreditoDto.cliente_id }
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente #${createCreditoDto.cliente_id} no encontrado`);
    }

    if (!cliente.activo) {
      throw new BadRequestException(`Cliente #${createCreditoDto.cliente_id} está inactivo`);
    }

    const credito = this.creditosRepository.create({
      ...createCreditoDto,
      saldo_pendiente: createCreditoDto.precio_venta,
      estado: 'ACTIVO'
    });

    return this.creditosRepository.save(credito);
  }

  async update(id: number, updateCreditoDto: Partial<CreateCreditoDto>) {
    const credito = await this.creditosRepository.findOne({
      where: { id },
      relations: ['cliente']
    });

    if (!credito) {
      throw new NotFoundException(`Crédito #${id} no encontrado`);
    }

    // Si se está cambiando el cliente, verificar que existe y está activo
    if (updateCreditoDto.cliente_id && updateCreditoDto.cliente_id !== credito.cliente_id) {
      const nuevoCliente = await this.clientesRepository.findOne({
        where: { id: updateCreditoDto.cliente_id }
      });

      if (!nuevoCliente) {
        throw new NotFoundException(`Cliente #${updateCreditoDto.cliente_id} no encontrado`);
      }

      if (!nuevoCliente.activo) {
        throw new BadRequestException(`Cliente #${updateCreditoDto.cliente_id} está inactivo`);
      }
    }

    // Si se modifica el precio_venta, actualizar el saldo_pendiente
    if (updateCreditoDto.precio_venta) {
      const diferencia = updateCreditoDto.precio_venta - credito.precio_venta;
      credito.saldo_pendiente += diferencia;
    }

    // Actualizar el crédito con los nuevos datos
    Object.assign(credito, updateCreditoDto);

    return this.creditosRepository.save(credito);
  }
}
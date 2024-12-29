import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from '../entities/pago.entity';
import { CreatePagoDto } from '../dto/create-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private pagosRepository: Repository<Pago>,
  ) {}

  async create(createPagoDto: CreatePagoDto): Promise<Pago> {
    const pago = this.pagosRepository.create({
      ...createPagoDto,
      credito: { id: createPagoDto.credito_id }
    });
    return this.pagosRepository.save(pago);
  }

  async findByCredito(creditoId: number): Promise<Pago[]> {
    const pagos = await this.pagosRepository.find({
      where: { credito: { id: creditoId } },
      relations: ['credito'],
      order: { fecha_pago: 'DESC' }
    });

    if (!pagos.length) {
      throw new NotFoundException(`No se encontraron pagos para el crédito #${creditoId}`);
    }

    return pagos;
  }

  async findAll(): Promise<Pago[]> {
    return this.pagosRepository.find({
      relations: ['credito'],
      order: { fecha_pago: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Pago> {
    const pago = await this.pagosRepository.findOne({
      where: { id },
      relations: ['credito']
    });

    if (!pago) {
      throw new NotFoundException(`Pago #${id} no encontrado`);
    }

    return pago;
  }
}
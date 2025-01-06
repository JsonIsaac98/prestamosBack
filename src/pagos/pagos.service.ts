import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from '../entities/pago.entity';
import { Credito } from '../entities/credito.entity';
import { CreatePagoDto } from '../dto/create-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private pagosRepository: Repository<Pago>,
    @InjectRepository(Credito)
    private creditosRepository: Repository<Credito>,
  ) {}

  async findByCreditoId(creditoId: number) {
    return this.pagosRepository.find({
      where: { credito_id: creditoId },
      order: { fecha_pago: 'DESC' }
    });
  }

  async create(createPagoDto: CreatePagoDto) {
    const credito = await this.creditosRepository.findOne({
      where: { id: createPagoDto.credito_id }
    });

    if (!credito) {
      throw new NotFoundException(`Crédito #${createPagoDto.credito_id} no encontrado`);
    }

    if (credito.estado === 'PAGADO') {
      throw new BadRequestException('Este crédito ya está pagado');
    }

    if (createPagoDto.monto > credito.saldo_pendiente) {
      throw new BadRequestException(`El monto del pago (${createPagoDto.monto}) excede el saldo pendiente (${credito.saldo_pendiente})`);
    }

    const pago = this.pagosRepository.create(createPagoDto);
    return this.pagosRepository.save(pago);
  }

  async anularPago(id: number) {
    const pago = await this.pagosRepository.findOne({
        where: { id },
        relations: ['credito']
    });

    if (!pago) {
        throw new NotFoundException(`Pago #${id} no encontrado`);
    }

    if (pago.estado === 'ANULADO') {
        throw new BadRequestException('Este pago ya está anulado');
    }

    // Actualizar estado y fecha en la misma operación
    pago.estado = 'ANULADO';
    pago.fecha_pago = new Date(); // Actualiza la fecha al momento de la anulación

    return this.pagosRepository.save(pago);
  }
}
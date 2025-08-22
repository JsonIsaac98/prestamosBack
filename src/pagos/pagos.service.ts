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
    throw new BadRequestException(
      `El monto del pago (${createPagoDto.monto}) excede el saldo pendiente (${credito.saldo_pendiente})`
    );
  }

  // 1. Crear y guardar pago
  const pago = this.pagosRepository.create(createPagoDto);
  const nuevoPago = await this.pagosRepository.save(pago);

  // 2. Actualizar saldo
  credito.saldo_pendiente -= createPagoDto.monto;

  // 3. Actualizar estado
  if (credito.saldo_pendiente === 0) {
    credito.estado = 'PAGADO';
  } else if (credito.estado !== 'ATRASADO') {
    // solo lo paso a ACTIVO si no está atrasado
    credito.estado = 'ACTIVO';
  }

  await this.creditosRepository.save(credito);

  return nuevoPago;
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

  const credito = pago.credito;

  // 1. Devolver saldo
  credito.saldo_pendiente += pago.monto;

  // 2. Ajustar estado
  if (credito.estado === 'PAGADO') {
    // si estaba pagado y ahora tiene saldo -> regresa a ACTIVO
    credito.estado = 'ACTIVO';
  }
  // si estaba ATRASADO lo dejamos igual, porque sigue siendo moroso

  // 3. Actualizar pago
  pago.estado = 'ANULADO';
  pago.fecha_pago = new Date();

  await this.creditosRepository.save(credito);
  return this.pagosRepository.save(pago);
}


}
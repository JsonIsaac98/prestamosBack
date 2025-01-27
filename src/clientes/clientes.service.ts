import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Credito } from '../entities/credito.entity';
import { CreateClienteDto } from '../dto/create-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
    @InjectRepository(Credito)
    private creditosRepository: Repository<Credito>,
  ) {}

  async findAll(): Promise<Cliente[]> {
    return this.clientesRepository.find({
      relations: ['creditos'],
      order: {
        nombre: 'ASC',
      },
    });
  }

  async findAllIsActive(): Promise<Cliente[]> {
    return this.clientesRepository.find({
      where: {
        activo: true
      }
    });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOne({
      where: { id },
      relations: ['creditos'],
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente #${id} no encontrado`);
    }
    return cliente;
  }

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    // Verificar si ya existe un cliente con el mismo DPI
    const existingCliente = await this.clientesRepository.findOne({
      where: { dpi: createClienteDto.dpi }
    });

    if (existingCliente) {
      throw new BadRequestException(`Ya existe un cliente con el DPI ${createClienteDto.dpi}`);
    }

    const cliente = this.clientesRepository.create(createClienteDto);
    return this.clientesRepository.save(cliente);
  }

  async update(id: number, updateClienteDto: Partial<CreateClienteDto>): Promise<Cliente> {
    const cliente = await this.findOne(id);

    // Si se está actualizando el DPI, verificar que no exista ya
    if (updateClienteDto.dpi && updateClienteDto.dpi !== cliente.dpi) {
      const existingCliente = await this.clientesRepository.findOne({
        where: { dpi: updateClienteDto.dpi }
      });

      if (existingCliente) {
        throw new BadRequestException(`Ya existe un cliente con el DPI ${updateClienteDto.dpi}`);
      }
    }

    Object.assign(cliente, updateClienteDto);
    return this.clientesRepository.save(cliente);
  }

  async softDelete(id: number): Promise<void> {
    const cliente = await this.findOne(id);
    
    // Verificar si tiene créditos activos
    const creditosActivos = await this.creditosRepository.count({
      where: {
        id: id,
        estado: 'ACTIVO'
      }
    });

    if (creditosActivos > 0) {
      throw new BadRequestException('No se puede eliminar un cliente con créditos activos');
    }

    // Soft delete
    cliente.activo = false;
    await this.clientesRepository.save(cliente);
  }

  async getResumenCliente(id: number) {
    const cliente = await this.findOne(id);
    
    const resumen = await this.creditosRepository
      .createQueryBuilder('credito')
      .where('credito.cliente_id = :id', { id })
      .select([
        'COUNT(credito.id) as total_creditos',
        'SUM(CASE WHEN credito.estado = \'ACTIVO\' THEN 1 ELSE 0 END) as creditos_activos',
        'SUM(CASE WHEN credito.estado = \'ATRASADO\' THEN 1 ELSE 0 END) as creditos_atrasados',
        'SUM(credito.saldo_pendiente) as saldo_total'
      ])
      .getRawOne();

    return {
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        dpi: cliente.dpi,
        telefono: cliente.telefono
      },
      ...resumen
    };
  }
}
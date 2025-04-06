// src/creditos/creditos.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Credito } from '../entities/credito.entity';
import { Cliente } from '../entities/cliente.entity';
import { DetalleCreditoJoya } from '../entities/detalle-credito-joya.entity';
import { CreateCreditoDto } from '../dto/create-credito.dto';
import { CreateCreditoConJoyasDto } from '../dto/create-credito-con-joyas.dto';
import { DetalleJoyaDto } from '../dto/detalle-joya.dto';
import { InventarioService } from '../inventario/inventario.service';

@Injectable()
export class CreditosService {
  constructor(
    @InjectRepository(Credito)
    private creditosRepository: Repository<Credito>,
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
    @InjectRepository(DetalleCreditoJoya)
    private detalleCreditoJoyaRepository: Repository<DetalleCreditoJoya>,
    private inventarioService: InventarioService,
    private dataSource: DataSource,
  ) {}

  async findAll(estado?: 'ACTIVO' | 'PAGADO' | 'ATRASADO') {
    const where = estado ? { estado } : {};
    return this.creditosRepository.find({
      where,
      relations: ['cliente', 'pagos', 'detalles_joya', 'detalles_joya.inventario', 'detalles_joya.inventario.categoria'],
      order: { fecha_credito: 'DESC' }
    });
  }

  async findOne(id: number) {
    const credito = await this.creditosRepository.findOne({
      where: { id },
      relations: ['cliente', 'pagos', 'detalles_joya', 'detalles_joya.inventario', 'detalles_joya.inventario.categoria']
    });
    if (!credito) {
      throw new NotFoundException(`Crédito #${id} no encontrado`);
    }
    return credito;
  }

  async findByCliente(clienteId: number) {
    return this.creditosRepository.find({
      where: { cliente_id: clienteId },
      relations: ['cliente', 'pagos', 'detalles_joya', 'detalles_joya.inventario', 'detalles_joya.inventario.categoria'],
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

  // Nuevo método para crear crédito con detalles de joyas
  async createConJoyas(createCreditoConJoyasDto: CreateCreditoConJoyasDto) {
    // Usar transacción para garantizar que todo se guarde correctamente
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Verificar cliente
      const cliente = await this.clientesRepository.findOne({
        where: { id: createCreditoConJoyasDto.cliente_id }
      });
      if (!cliente) {
        throw new NotFoundException(`Cliente #${createCreditoConJoyasDto.cliente_id} no encontrado`);
      }
      if (!cliente.activo) {
        throw new BadRequestException(`Cliente #${createCreditoConJoyasDto.cliente_id} está inactivo`);
      }

      // Validar todos los detalles de joyas y calcular precio total
      let precioVentaTotal = 0;
      const detallesValidados = [];

      for (const detalle of createCreditoConJoyasDto.detalles_joya) {
        // Verificar disponibilidad en inventario
        const { inventario, precioGramo } = await this.inventarioService.verificarDisponibilidad(
          detalle.inventario_id, 
          detalle.gramos_vendidos
        );

        // Calcular subtotales
        const subtotalCalculado = Number(detalle.gramos_vendidos) * Number(precioGramo);
        const subtotalFinal = detalle.precio_final || subtotalCalculado;
        
        // Sumar al precio total
        precioVentaTotal += subtotalFinal;
        
        // Guardar para procesar después
        detallesValidados.push({
          ...detalle,
          precioGramo,
          subtotalCalculado,
          subtotalFinal
        });
      }
      
      // Crear el crédito
      const credito = this.creditosRepository.create({
        cliente_id: createCreditoConJoyasDto.cliente_id,
        descripcion_articulo: createCreditoConJoyasDto.descripcion_articulo,
        precio_venta: precioVentaTotal,
        plazo_meses: createCreditoConJoyasDto.plazo_meses,
        tasa_interes: createCreditoConJoyasDto.tasa_interes,
        saldo_pendiente: precioVentaTotal,
        estado: 'ACTIVO',
        fecha_credito: new Date()
      });
      
      const creditoGuardado = await this.creditosRepository.save(credito);
      
      // Guardar todos los detalles
      for (const detalle of detallesValidados) {
        const detalleJoya = this.detalleCreditoJoyaRepository.create({
          credito_id: creditoGuardado.id,
          inventario_id: detalle.inventario_id,
          gramos_vendidos: detalle.gramos_vendidos,
          precio_venta_gramo: detalle.precioGramo,
          subtotal_calculado: detalle.subtotalCalculado,
          subtotal_final: detalle.subtotalFinal
        });
        await this.detalleCreditoJoyaRepository.save(detalleJoya);
        
        // Reducir el inventario
        await this.inventarioService.reducirInventario(detalle.inventario_id, detalle.gramos_vendidos);
      }
      
      // Confirmar la transacción
      await queryRunner.commitTransaction();
      
      // Retornar el crédito con todos sus detalles
      return this.findOne(creditoGuardado.id);
      
    } catch (error) {
      // Si hay algún error, revertir todos los cambios
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
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

  // Método para obtener detalles de joyas de un crédito
  async getDetallesJoya(creditoId: number) {
    const credito = await this.findOne(creditoId);
    return credito.detalles_joya;
  }

  // Método para agregar un detalle de joya a un crédito existente
  async agregarDetalleJoya(creditoId: number, detalleJoyaDto: DetalleJoyaDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const credito = await this.findOne(creditoId);
      
      // Verificar disponibilidad en inventario
      const { inventario, precioGramo } = await this.inventarioService.verificarDisponibilidad(
        detalleJoyaDto.inventario_id, 
        detalleJoyaDto.gramos_vendidos
      );
      
      // Calcular subtotales
      const subtotalCalculado = Number(detalleJoyaDto.gramos_vendidos) * Number(precioGramo);
      const subtotalFinal = detalleJoyaDto.precio_final || subtotalCalculado;
      
      // Crear detalle
      const detalleJoya = this.detalleCreditoJoyaRepository.create({
        credito_id: creditoId,
        inventario_id: detalleJoyaDto.inventario_id,
        gramos_vendidos: detalleJoyaDto.gramos_vendidos,
        precio_venta_gramo: precioGramo,
        subtotal_calculado: subtotalCalculado,
        subtotal_final: subtotalFinal
      });
      
      await this.detalleCreditoJoyaRepository.save(detalleJoya);
      
      // Actualizar el precio y saldo del crédito
      credito.precio_venta += subtotalFinal;
      credito.saldo_pendiente += subtotalFinal;
      await this.creditosRepository.save(credito);
      
      // Reducir el inventario
      await this.inventarioService.reducirInventario(detalleJoyaDto.inventario_id, detalleJoyaDto.gramos_vendidos);
      
      // Confirmar la transacción
      await queryRunner.commitTransaction();
      
      return this.findOne(creditoId);
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
// src/ventas/ventas.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { VentaContado } from '../entities/venta-contado.entity';
import { Cliente } from '../entities/cliente.entity';
import { DetalleCreditoJoya } from '../entities/detalle-credito-joya.entity';
import { CreateVentaContadoDto } from '../dto/venta-contado.dto';
import { InventarioService } from '../inventario/inventario.service';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(VentaContado)
    private ventasRepository: Repository<VentaContado>,
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
    @InjectRepository(DetalleCreditoJoya)
    private detalleCreditoJoyaRepository: Repository<DetalleCreditoJoya>,
    private inventarioService: InventarioService,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    return this.ventasRepository.find({
      relations: ['cliente', 'detalles_joya', 'detalles_joya.inventario', 'detalles_joya.inventario.categoria'],
      order: { fecha_venta: 'DESC' }
    });
  }

  async findOne(id: number) {
    const venta = await this.ventasRepository.findOne({
      where: { id },
      relations: ['cliente', 'detalles_joya', 'detalles_joya.inventario', 'detalles_joya.inventario.categoria']
    });
    if (!venta) {
      throw new NotFoundException(`Venta al contado #${id} no encontrada`);
    }
    return venta;
  }

  async findByCliente(clienteId: number) {
    return this.ventasRepository.find({
      where: { cliente_id: clienteId },
      relations: ['cliente', 'detalles_joya', 'detalles_joya.inventario', 'detalles_joya.inventario.categoria'],
      order: { fecha_venta: 'DESC' }
    });
  }

  async create(createVentaDto: CreateVentaContadoDto) {
    // Usar transacción para garantizar que todo se guarde correctamente
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Verificar cliente
      const cliente = await this.clientesRepository.findOne({
        where: { id: createVentaDto.cliente_id }
      });
      if (!cliente) {
        throw new NotFoundException(`Cliente #${createVentaDto.cliente_id} no encontrado`);
      }
      if (!cliente.activo) {
        throw new BadRequestException(`Cliente #${createVentaDto.cliente_id} está inactivo`);
      }

      // Validar todos los detalles de joyas y calcular precio total
      let precioVentaTotal = 0;
      const detallesValidados = [];

      for (const detalle of createVentaDto.detalles_joya) {
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
      
      // Crear la venta al contado
      const venta = this.ventasRepository.create({
        cliente_id: createVentaDto.cliente_id,
        descripcion_articulo: createVentaDto.descripcion_articulo,
        precio_venta: precioVentaTotal,
        fecha_venta: new Date()
      });
      
      const ventaGuardada = await this.ventasRepository.save(venta);
      
      // Guardar todos los detalles
      for (const detalle of detallesValidados) {
        const detalleJoya = this.detalleCreditoJoyaRepository.create({
          credito_id: ventaGuardada.id, // Usamos el mismo campo aunque sea para venta al contado
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
      
      // Retornar la venta con todos sus detalles
      return this.findOne(ventaGuardada.id);
      
    } catch (error) {
      // Si hay algún error, revertir todos los cambios
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }
}
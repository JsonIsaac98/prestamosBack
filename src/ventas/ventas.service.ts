// src/ventas/ventas.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { VentaContado } from '../entities/venta-contado.entity';
import { Cliente } from '../entities/cliente.entity';
import { DetalleCreditoJoya } from '../entities/detalle-credito-joya.entity';
import { CreateVentaContadoDto } from '../dto/venta-contado.dto';
import { InventarioService } from '../inventario/inventario.service';
import { CreateCreditoConJoyasDto } from 'src/dto/create-credito-con-joyas.dto';

import { DetalleVentaJoya } from '../entities/detalle-venta-joya.entity';
import { Credito } from '../entities/credito.entity';
import { InventarioJoya } from '../entities/inventario-joya.entity';
import { MovimientoInventario, TipoMovimiento } from '../entities/movimiento-inventario.entity';

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

  async createVentaContado(dto: CreateVentaContadoDto) {
    return this.dataSource.transaction(async manager => {
      const venta = manager.create(VentaContado, {
        cliente_id: dto.cliente_id,
        descripcion_articulo: dto.descripcion_articulo,
        // guardar el precio_venta
        precio_venta: dto.precio_venta
      });
      await manager.save(venta);

      for (const detalle of dto.detalles_joya) {
        const det = manager.create(DetalleVentaJoya, {
          venta,
          inventario_id: detalle.inventario_id,
          gramos_vendidos: detalle.gramos_vendidos,
          precio_venta_gramo: detalle.precio_final,
          subtotal_calculado: detalle.precio_final,
          subtotal_final: detalle.precio_final,
        });
        await manager.save(det);

        await manager.decrement(
          InventarioJoya,
          { id: detalle.inventario_id },
          'gramos_disponible',
          detalle.gramos_vendidos,
        );

        const inventario = await manager.findOne(InventarioJoya, {
          where: { id: detalle.inventario_id },
          relations: ['categoria'],
        });

        if (!inventario) {
          throw new BadRequestException(`Inventario con ID ${detalle.inventario_id} no encontrado`);
        }

        const mov = manager.create(MovimientoInventario, {
          categoria_id: inventario.categoria_id,  // ✅ este sí existe
          tipo_movimiento: TipoMovimiento.VENTA,              // ✅ tu enum
          gramos: detalle.gramos_vendidos,       // ✅ coincide con la entidad
          costo_unitario: detalle.precio_final / detalle.gramos_vendidos,
          costo_total: detalle.precio_final,
          descripcion: `Venta joya`,
          referencia_id: venta.id,               // ✅ referencia a la venta
        });
        await manager.save(mov);
      }

      return venta;
    });
  }

  async createVentaCredito(dto: CreateCreditoConJoyasDto) {
    return this.dataSource.transaction(async manager => {
      const credito = manager.create(Credito, {
        cliente_id: dto.cliente_id,
        descripcion_articulo: dto.descripcion_articulo,
        precio_venta: dto.precio_venta,
        saldo_pendiente: dto.saldo_pendiente,
        plazo_meses: dto.plazo_meses,
        tasa_interes: dto.tasa_interes,
      });
      await manager.save(credito);

      for (const detalle of dto.detalles_joya) {
        const det = manager.create(DetalleCreditoJoya, {
          credito,
          inventario_id: detalle.inventario_id,
          gramos_vendidos: detalle.gramos_vendidos,
          precio_final: detalle.precio_final,
        });
        await manager.save(det);

        await manager.decrement(
          InventarioJoya,
          { id: detalle.inventario_id },
          'gramos_disponible',
          detalle.gramos_vendidos,
        );

        const inventario = await manager.findOne(InventarioJoya, {
          where: { id: detalle.inventario_id },
          relations: ['categoria'],
        });

        if (!inventario) {
          throw new BadRequestException(`Inventario con ID ${detalle.inventario_id} no encontrado`);
        }

        const mov = manager.create(MovimientoInventario, {
          categoria_id: inventario.categoria_id,  // ✅ este sí existe
          tipo_movimiento: TipoMovimiento.VENTA,              // ✅ tu enum
          gramos: detalle.gramos_vendidos,       // ✅ coincide con la entidad
          costo_unitario: detalle.precio_final / detalle.gramos_vendidos,
          costo_total: detalle.precio_final,
          descripcion: `Venta joya`,
          referencia_id: credito.id,               // ✅ referencia a la venta
        });
        await manager.save(mov);
      }

      return credito;
    });
  }

}
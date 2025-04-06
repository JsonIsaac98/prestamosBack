// src/inventario/inventario.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaJoya } from '../entities/categoria-joya.entity';
import { InventarioJoya } from '../entities/inventario-joya.entity';
import { CreateCategoriaJoyaDto } from '../dto/create-categoria-joya.dto';
import { CreateInventarioJoyaDto } from '../dto/create-inventario-joya.dto';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(CategoriaJoya)
    private categoriasRepository: Repository<CategoriaJoya>,
    @InjectRepository(InventarioJoya)
    private inventarioRepository: Repository<InventarioJoya>,
  ) {}

  // Métodos para categorías
  async getAllCategorias() {
    return this.categoriasRepository.find({
      order: { nombre: 'ASC' },
      where: { activo: true },
    });
  }

  async getCategoriaById(id: number) {
    const categoria = await this.categoriasRepository.findOne({
      where: { id },
    });
    if (!categoria) {
      throw new NotFoundException(`Categoría de joya #${id} no encontrada`);
    }
    return categoria;
  }

  async createCategoria(createCategoriaDto: CreateCategoriaJoyaDto) {
    const categoria = this.categoriasRepository.create(createCategoriaDto);
    return this.categoriasRepository.save(categoria);
  }

  async updateCategoria(id: number, updateCategoriaDto: Partial<CreateCategoriaJoyaDto>) {
    const categoria = await this.getCategoriaById(id);
    Object.assign(categoria, updateCategoriaDto);
    return this.categoriasRepository.save(categoria);
  }

  // Métodos para inventario
  async getAllInventario() {
    return this.inventarioRepository.find({
      relations: ['categoria'],
      where: { activo: true },
      order: { fecha_ingreso: 'DESC' },
    });
  }

  async getInventarioById(id: number) {
    const inventario = await this.inventarioRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });
    if (!inventario) {
      throw new NotFoundException(`Inventario de joya #${id} no encontrado`);
    }
    return inventario;
  }

  async createInventario(createInventarioDto: CreateInventarioJoyaDto) {
    // Verificar que la categoría existe
    await this.getCategoriaById(createInventarioDto.categoria_id);

    const inventario = this.inventarioRepository.create({
      ...createInventarioDto,
      gramos_disponible: createInventarioDto.gramos_total,
    });
    return this.inventarioRepository.save(inventario);
  }

  async updateInventario(id: number, updateInventarioDto: Partial<CreateInventarioJoyaDto>) {
    const inventario = await this.getInventarioById(id);

    // Si se cambia la categoría, verificar que existe
    if (updateInventarioDto.categoria_id && updateInventarioDto.categoria_id !== inventario.categoria_id) {
      await this.getCategoriaById(updateInventarioDto.categoria_id);
    }

    // Si se modifica el total de gramos, ajustar también el disponible
    if (updateInventarioDto.gramos_total) {
      const diferencia = updateInventarioDto.gramos_total - inventario.gramos_total;
      inventario.gramos_disponible += diferencia;
      if (inventario.gramos_disponible < 0) {
        throw new BadRequestException('No se puede reducir el total de gramos por debajo de lo ya vendido');
      }
    }

    Object.assign(inventario, updateInventarioDto);
    return this.inventarioRepository.save(inventario);
  }

  // Método para verificar disponibilidad y reducir inventario
  async verificarDisponibilidad(inventarioId: number, gramosVendidos: number) {
    const inventario = await this.getInventarioById(inventarioId);
    
    if (!inventario.activo) {
      throw new BadRequestException(`El inventario #${inventarioId} está inactivo`);
    }
    
    if (inventario.gramos_disponible < gramosVendidos) {
      throw new BadRequestException(
        `No hay suficientes gramos disponibles. Solicitados: ${gramosVendidos}, Disponibles: ${inventario.gramos_disponible}`
      );
    }
    
    return {
      inventario,
      precioGramo: inventario.categoria.precio_gramo,
    };
  }

  // Método para reducir el inventario después de una venta
  async reducirInventario(inventarioId: number, gramosVendidos: number) {
    const inventario = await this.getInventarioById(inventarioId);
    
    inventario.gramos_disponible -= gramosVendidos;
    
    // Si ya no queda inventario disponible, marcar como inactivo
    if (inventario.gramos_disponible <= 0) {
      inventario.activo = false;
    }
    
    return this.inventarioRepository.save(inventario);
  }
}
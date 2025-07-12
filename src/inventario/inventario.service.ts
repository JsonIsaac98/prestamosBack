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

  // === CATEGORÍAS ===
  async getAllCategorias() {
    return this.categoriasRepository.find({
      order: { nombre: 'ASC' },
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

  // === INVENTARIO ACTUAL ===
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

  // === MÉTODOS REQUERIDOS POR EL SISTEMA ACTUAL ===
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
      precioGramo: inventario.categoria.precio_gramo || inventario.costo_adquisicion,
    };
  }

  async reducirInventario(inventarioId: number, gramosVendidos: number) {
    const inventario = await this.getInventarioById(inventarioId);
    
    inventario.gramos_disponible -= gramosVendidos;
    
    // Si ya no queda inventario disponible, marcar como inactivo
    if (inventario.gramos_disponible <= 0) {
      inventario.activo = false;
    }
    
    return this.inventarioRepository.save(inventario);
  }

  // === MÉTODOS PARA ESTADÍSTICAS BÁSICAS ===
  async getEstadisticas() {
    // Calcular estadísticas basadas en el inventario actual
    const inventarios = await this.inventarioRepository.find({
      relations: ['categoria'],
      where: { activo: true },
    });

    const categorias = await this.categoriasRepository.find();
    
    const totalCategorias = categorias.length;
    const valorTotalInventario = inventarios.reduce((total, inv) => 
      total + (inv.gramos_disponible * inv.costo_adquisicion), 0);
    const gramosTotales = inventarios.reduce((total, inv) => total + inv.gramos_total, 0);
    const gramosDisponibles = inventarios.reduce((total, inv) => total + inv.gramos_disponible, 0);

    return {
      total_categorias: totalCategorias,
      valor_total_inventario: valorTotalInventario,
      gramos_totales: gramosTotales,
      gramos_disponibles: gramosDisponibles,
      movimientos_mes: 0, // Por ahora 0, se implementará con el nuevo sistema
    };
  }

  async getEstadisticasPorCategoria() {
    // Agrupar inventarios por categoría
    const inventarios = await this.inventarioRepository.find({
      relations: ['categoria'],
      where: { activo: true },
    });

    const categoriasMap = new Map();

    inventarios.forEach(inv => {
      const categoriaId = inv.categoria_id;
      if (!categoriasMap.has(categoriaId)) {
        categoriasMap.set(categoriaId, {
          id: categoriaId,
          categoria_id: categoriaId,
          categoria: inv.categoria,
          gramos_total: 0,
          gramos_disponible: 0,
          gramos_vendido: 0,
          costo_promedio: 0,
          valor_total: 0,
        });
      }

      const stats = categoriasMap.get(categoriaId);
      stats.gramos_total += inv.gramos_total;
      stats.gramos_disponible += inv.gramos_disponible;
      stats.gramos_vendido += (inv.gramos_total - inv.gramos_disponible);
      
      // Costo promedio ponderado
      const pesoAnterior = stats.gramos_total - inv.gramos_total;
      if (stats.gramos_total > 0) {
        stats.costo_promedio = (
          (stats.costo_promedio * pesoAnterior) + 
          (inv.costo_adquisicion * inv.gramos_total)
        ) / stats.gramos_total;
      }
      
      stats.valor_total = stats.gramos_disponible * stats.costo_promedio;
    });

    return Array.from(categoriasMap.values());
  }

  // === MÉTODOS PARA EL NUEVO DASHBOARD ===
  async getStock() {
    // Simular el formato del nuevo sistema usando el inventario actual
    return this.getEstadisticasPorCategoria();
  }

  async getMovimientos(categoriaId?: number, limit?: number) {
    // Por ahora devolver array vacío, se implementará con el nuevo sistema
    return [];
  }

  async verificarStockDisponible(categoriaId: number, gramosRequeridos: number) {
    // Calcular stock disponible por categoría del sistema actual
    const inventarios = await this.inventarioRepository.find({
      where: { 
        categoria_id: categoriaId,
        activo: true 
      },
    });

    const gramosDisponibles = inventarios.reduce((total, inv) => 
      total + inv.gramos_disponible, 0);

    return {
      disponible: gramosDisponibles >= gramosRequeridos,
      gramos_disponibles: gramosDisponibles,
    };
  }
}
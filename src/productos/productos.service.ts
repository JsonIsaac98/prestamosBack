import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { CreateProductoDto } from '../dto/create-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productosRepository.create(createProductoDto);
    return this.productosRepository.save(producto);
  }

  findAll(): Promise<Producto[]> {
    return this.productosRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id }
    });
    if (!producto) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: Partial<CreateProductoDto>): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id }
    });
    if (!producto) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    this.productosRepository.merge(producto, updateProductoDto);
    return this.productosRepository.save(producto);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.productosRepository.findOne({
      where: { id }
    });
    if (!producto) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    await this.productosRepository.remove(producto);
  }
}
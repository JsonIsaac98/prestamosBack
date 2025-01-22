// src/users/users.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    // Ya no hasheamos la contraseña
    return this.usersRepository.save(user);
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.findOne(userId);
    
    // Comparación directa sin bcrypt
    if (user.password !== oldPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = newPassword;
    user.isFirstLogin = false;
    
    return this.usersRepository.save(user);
  }
}
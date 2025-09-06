// src/users/users.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // 👈 10 salt rounds
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async createForCliente(clienteId: number, telefono: string, email?: string) {
    const defaultPassword = '123456';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = this.usersRepository.create({
      username: telefono,
      password: hashedPassword, // 👈 guardar hash
      email: email ?? `${telefono}@autogen.local`,
      role: 'client',
      isFirstLogin: true,
      clienteId,
      active: true,
    });

    return this.usersRepository.save(user);
  }
// reset password default to '123456'
  async resetPassword(userId: number) {
    const user = await this.findOne(userId);
    const defaultPassword = '123456';
    user.password = await bcrypt.hash(defaultPassword, 10);
    user.isFirstLogin = true;
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

  async findByClienteId(clienteId: number) {
  return this.usersRepository.findOne({ where: { clienteId } });
}


  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.findOne(userId);

    // Validar la contraseña vieja
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hashear la nueva contraseña
    user.password = await bcrypt.hash(newPassword, 10);
    user.isFirstLogin = false;

    return this.usersRepository.save(user);
  }

}
// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      // MySQL error number for duplicate entry
      if (error.errno === 1062) {
        throw new ConflictException('Username or email already exists');
      }
      throw error;
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

@Post(':id/reset-password')
@UseGuards(JwtAuthGuard, RolesGuard) // solo admin debería poder hacerlo
@Roles('admin')
async resetPassword(@Param('id') clienteId: string) {
  // buscar user que tenga este cliente_id
  const user = await this.usersService.findByClienteId(+clienteId);
  if (!user) {
    throw new NotFoundException(`User not found for cliente ${clienteId}`);
  }
  return this.usersService.resetPassword(user.id);
}




  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.usersService.findOne(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

  return this.usersService.changePassword(
    req.user.id,
    changePasswordDto.oldPassword,
    changePasswordDto.newPassword,
  );
}



  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }
}

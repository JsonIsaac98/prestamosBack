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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Crear usuario', description: 'Crea un nuevo usuario en el sistema. Solo accesible por administradores.' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 409, description: 'El username o email ya existe.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Forbidden: se requiere rol admin.' })
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

  @ApiOperation({ summary: 'Ver perfil propio', description: 'Retorna la información del usuario autenticado.' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @ApiOperation({ summary: 'Resetear contraseña de usuario', description: 'Resetea la contraseña del usuario asociado al clienteId indicado. Solo admin.' })
  @ApiParam({ name: 'id', description: 'ID del cliente cuyo usuario se reseteará', example: 5 })
  @ApiResponse({ status: 200, description: 'Contraseña reseteada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado para ese cliente.' })
  @ApiResponse({ status: 403, description: 'Forbidden: se requiere rol admin.' })
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

  @ApiOperation({ summary: 'Cambiar contraseña propia', description: 'Permite al usuario autenticado cambiar su propia contraseña.' })
  @ApiResponse({ status: 200, description: 'Contraseña cambiada exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
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

  @ApiOperation({ summary: 'Listar todos los usuarios', description: 'Retorna todos los usuarios del sistema. Solo accesible por administradores.' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
  @ApiResponse({ status: 403, description: 'Forbidden: se requiere rol admin.' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }
}

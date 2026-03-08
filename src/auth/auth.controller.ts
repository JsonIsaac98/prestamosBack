// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Iniciar sesión', description: 'Autentica con username y password. Retorna un JWT.' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login exitoso. Retorna access_token JWT.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // Opcional: Endpoint para renovar el token
  @ApiOperation({ summary: 'Renovar token JWT', description: 'Renueva el token JWT del usuario autenticado.' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: 'Token renovado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado.' })
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req) {
    return this.authService.login(req.user);
  }
}

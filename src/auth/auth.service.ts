// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    // Comparación directa de contraseñas
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // src/auth/auth.service.ts
async login(user: any) {
  const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '24h' }), // o el tiempo que prefieras
    };
  }
}
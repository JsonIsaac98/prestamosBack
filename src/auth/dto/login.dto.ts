import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Nombre de usuario' })
  username: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
  password: string;
}

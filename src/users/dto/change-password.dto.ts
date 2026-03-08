import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'viejaPass123', description: 'Contraseña actual del usuario' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'nuevaPass456', description: 'Nueva contraseña (mínimo 6 caracteres)', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  newPassword: string;
}

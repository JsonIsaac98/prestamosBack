// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS si es necesario
  app.enableCors({
    origin: '*', // En producción especifica el dominio
    credentials: true,
  });

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Sistema de Préstamos y Joyería')
    .setDescription(
      'API REST para gestión de créditos, clientes, pagos, inventario de joyas y ventas.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT obtenido en /auth/login',
      },
      'JWT',
    )
    .addTag('Auth', 'Autenticación y renovación de tokens')
    .addTag('Users', 'Gestión de usuarios del sistema')
    .addTag('Clientes', 'Gestión de clientes')
    .addTag('Creditos', 'Gestión de créditos y préstamos')
    .addTag('Pagos', 'Registro y anulación de pagos')
    .addTag('Ventas', 'Ventas al contado y a crédito')
    .addTag('Inventario', 'Inventario de joyas y categorías')
    .addTag('Dashboard', 'Estadísticas y métricas generales')
    .addTag('Reports', 'Reportes de pagos, morosos y balance')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Escucha en todas las interfaces

  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
  console.log(`📄 Swagger docs available at: http://0.0.0.0:${port}/api/docs`);
  console.log(`🗄️  Database host: ${process.env.DB_HOST}`);
}
bootstrap();

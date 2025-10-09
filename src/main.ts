// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS si es necesario
  app.enableCors({
    origin: '*', // En producción especifica el dominio
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Escucha en todas las interfaces
  
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
  console.log(`🗄️  Database host: ${process.env.DB_HOST}`);
}
bootstrap();
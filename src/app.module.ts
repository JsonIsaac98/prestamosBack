import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './clientes/clientes.module';
import { CreditosModule } from './creditos/creditos.module';
import { PagosModule } from './pagos/pagos.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InventarioService } from './inventario/inventario.service';
import { InventarioModule } from './inventario/inventario.module';

import { CategoriaJoya } from './entities/categoria-joya.entity';
import { InventarioJoya } from './entities/inventario-joya.entity';
import { DetalleCreditoJoya } from './entities/detalle-credito-joya.entity';
import { VentasModule } from './ventas/ventas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: process.env.DB_HOST || 'localhost',
      host: "localhost", //process.env.DB_HOST || 'localhost',
      // port: parseInt(process.env.DB_PORT) || 3306,
      port: 3306, //parseInt(process.env.DB_PORT) || 3306,

      // username: process.env.DB_USERNAME || 'user',
      username: "root", //process.env.DB_USERNAME || 'user',
      // password: process.env.DB_PASSWORD || 'password',
      password: '', //process.env.DB_PASSWORD || 'password',
      // database: process.env.DB_DATABASE || 'mydatabase',
      database: "mydatabase", //process.env.DB_DATABASE || 'mydatabase',

      entities: [
        // Incluye tus entidades existentes
        'dist/**/*.entity{.ts,.js}',
        // También incluye las nuevas entidades explícitamente 
        // (esto asegura que estén disponibles incluso si el patrón glob no las captura)
        CategoriaJoya,
        InventarioJoya,
        DetalleCreditoJoya
      ],
      synchronize: true,
      autoLoadEntities: true, // Esto ayuda a asegurar que las entidades de todos los módulos se carguen
    }),
    ClientesModule,
    CreditosModule,
    PagosModule,
    DashboardModule,
    ReportsModule,
    AuthModule,
    UsersModule,
    InventarioModule,
    VentasModule,
  ],
  controllers: [AppController],
  providers: [AppService], // Quita InventarioService de aquí
})
export class AppModule {}
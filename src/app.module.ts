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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: "localhost", //process.env.DB_HOST || 'localhost',
      port: 3306, //parseInt(process.env.DB_PORT) || 3306,
      username: "root", //process.env.DB_USERNAME || 'user',
      password: '', //process.env.DB_PASSWORD || 'password',
      database: "mydatabase", //process.env.DB_DATABASE || 'mydatabase',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ClientesModule,
    CreditosModule,
    PagosModule,
    DashboardModule,
    ReportsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
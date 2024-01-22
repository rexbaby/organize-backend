import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './core/http-exception.filter';
import { District } from './entity/district';
import { Dept } from './entity/dept';
import { DistrictController } from './controller/district.controller';
import { DeptController } from './controller/dept.controller';
import { DeptService } from './service/dept.service';
import { DistrictService } from './service/district.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'organize',
      entities: [District, Dept],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([District, Dept]),
  ],
  controllers: [AppController, DistrictController, DeptController],
  providers: [
    AppService,
    DeptService,
    DistrictService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

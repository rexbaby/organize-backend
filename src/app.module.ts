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
import { StaffService } from './service/staff.service';
import { Staff } from './entity/staff';
import { Updistrict } from './entity/up-district';
import { Updept } from './entity/up-dept';
import { StaffController } from './controller/staff.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'emma@0414',
      database: 'organize',
      entities: [District, Dept, Staff, Updistrict, Updept],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([District, Dept, Staff, Updistrict, Updept]),
  ],
  controllers: [
    AppController,
    DistrictController,
    DeptController,
    StaffController
  ],
  providers: [
    AppService,
    DeptService,
    DistrictService,
    StaffService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule { }

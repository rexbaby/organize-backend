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
import { Rank } from './entity/rank';
import { RankController } from './controller/rank.controller';
import { RankService } from './service/rank.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'kubernetes.docker.internal',
      port: 3306,
      username: 'rexbaby',
      password: 'rexbaby@0427',
      database: 'organize',
      entities: [District, Dept, Staff, Rank],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([District, Dept, Staff, Rank]),
  ],
  controllers: [
    AppController,
    DistrictController,
    DeptController,
    RankController,
  ],
  providers: [
    AppService,
    DeptService,
    DistrictService,
    StaffService,
    RankService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

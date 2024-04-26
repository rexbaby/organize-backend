import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Dept, DeptDTO } from 'src/entity/dept';
import { District } from 'src/entity/district';
import { DeptService } from 'src/service/dept.service';

@Controller('dept')
export class DeptController {
  constructor(private deptService: DeptService) {}

  @Get()
  findAll() {
    return this.deptService.findAll();
  }

  @Get('district/:districtId')
  findAllByDistrict(@Param('districtId') id: number) {
    return this.deptService.findAllByDistrict(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.deptService.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() deptDTO: DeptDTO) {
    const p = plainToInstance(Dept, deptDTO);
    p.district = new District();
    p.district.id = deptDTO.districtId;
    return this.deptService.create(p);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dept: Dept) {
    return this.deptService.update(id, dept);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.deptService.delete(id);
  }
}

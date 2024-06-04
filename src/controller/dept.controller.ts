import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { CreateDeptDTO, UpdateDeptDTO } from 'src/entity/dept';
import { DeptService } from 'src/service/dept.service';

@Controller('api/dept')
export class DeptController {
  constructor(private deptService: DeptService) { }

  @Get()
  findAll() {
    return this.deptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.deptService.findOne(id);
  }

  @Get('district/:districtId')
  findAllByDistrict(@Param('districtId') id: number) {
    return this.deptService.findAllByDistrict(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() dto: CreateDeptDTO) {
    return this.deptService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateDeptDTO) {
    return this.deptService.update(id, dto);
  }

  @Patch(':id')
  partial(@Param('id') id: number, @Body() dto: UpdateDeptDTO) {
    return this.deptService.partial(id, dto);
  }
}

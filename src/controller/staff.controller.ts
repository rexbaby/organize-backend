import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateStaffDTO, UpdateStaffDTO } from 'src/entity/staff';
import { StaffService } from 'src/service/staff.service';

@Controller('api/staff')
export class StaffController {
  constructor(private staffService: StaffService) { }

  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.staffService.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() dto: CreateStaffDTO) {
    return this.staffService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateStaffDTO) {
    return this.staffService.update(id, dto);
  }

  @Patch(':id')
  partial(@Param('id') id: number, @Body() dto: UpdateStaffDTO) {
    return this.staffService.partial(id, dto);
  }
}
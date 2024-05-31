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
import { CreateDistrictDTO, UpdateDistrictDTO } from 'src/entity/district';
import { DistrictService } from 'src/service/district.service';

@Controller('api/district')
export class DistrictController {
  constructor(private districtService: DistrictService) { }

  @Get()
  findAll() {
    return this.districtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.districtService.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() dto: CreateDistrictDTO) {
    return this.districtService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateDistrictDTO) {
    return this.districtService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.districtService.delete(id);
  }
}

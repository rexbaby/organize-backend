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
import { District, DistrictDTO } from 'src/entity/district';
import { DistrictService } from 'src/service/district.service';

@Controller('district')
export class DistrictController {
  constructor(private districtService: DistrictService) {}

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
  create(@Body() districtDTO: DistrictDTO) {
    const p = plainToInstance(District, districtDTO);

    return this.districtService.create(p);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() district: District) {
    return this.districtService.update(id, district);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.districtService.delete(id);
  }
}

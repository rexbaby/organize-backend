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

  // 升遷
  @Post('up/:id')
  upManager(@Param('id') id: number, @Body() areaIds: { areaIds: number[] }) {
    return this.staffService.upManager(id, areaIds.areaIds)
  }

  // 升遷Test
  @Post('testup/district/:id')
  testAddDistrictManager(@Param('id') id: number, @Body() districtIds: { areaIds: number[] }) {
    return this.staffService.testAddDistrictManager(id, districtIds.areaIds)
  }

  @Post('testup/dept/:id')
  testAddDeptManager(@Param('id') id: number, @Body() deptIds: { areaIds: number[] }) {
    return this.staffService.testAddDeptManager(id, deptIds.areaIds)
  }

  // Test
  @Get('test/DistrictManager/:districtId')
  testDistrictManager(@Param('districtId') id: number) {
    return this.staffService.testDistrictManager(id);
  }

  @Get('test/DeptsByDistrict/:districtId')
  testDeptsByDistrict(@Param('districtId') id: number) {
    return this.staffService.testDeptsByDistrict(id);
  }

  @Get('test/DeptsManager/:depts')
  testDeptsManager(@Param('depts') depts: number[]) {
    return this.staffService.testDeptsManager(depts);
  }

  @Get('test/DeptManager/:deptId')
  testDeptManager(@Param('deptId') deptId: number) {
    return this.staffService.testDeptManager(deptId);
  }

  @Get('test/DeptsStaff/:depts')
  testDeptsStaff(@Param('depts') depts: number[]) {
    return this.staffService.testDeptsStaff(depts);
  }

  @Get('test/DeptStaff/:deptId')
  testDeptStaff(@Param('deptId') deptId: number) {
    return this.staffService.testDeptStaff(deptId);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { StaffUpService } from 'src/service/staff-up.service';

@Controller('api/staffup')
export class StaffUpController {
  constructor(private staffUpService: StaffUpService) { }

  @Post(':staffId')
  upManager(@Param('staffId') staffId: number, @Body() areaIds: { areaIds: number[] }) {
    return this.staffUpService.upManager(staffId, areaIds.areaIds)
  }

  /* 
   * 升遷Test
   */
  // 新增區經理跟區域關聯
  @Post('testAddDistrictManager/:staffId')
  testAddDistrictManager(@Param('staffId') staffId: number, @Body() districtIds: { areaIds: number[] }) {
    return this.staffUpService.testAddDistrictManager(staffId, districtIds.areaIds)
  }

  // 新增處經理跟通訊處關聯
  @Post('testAddDeptManager/:staffId')
  testAddDeptManager(@Param('staffId') staffId: number, @Body() deptIds: { areaIds: number[] }) {
    return this.staffUpService.testAddDeptManager(staffId, deptIds.areaIds)
  }

  // 刪除處經理跟通訊處關聯
  @Get('testDelDeptManager/:staffId')
  testDelDeptManager(@Param('staffId') staffId: number) {
    return this.staffUpService.testDelDeptManager(staffId)
  }
}
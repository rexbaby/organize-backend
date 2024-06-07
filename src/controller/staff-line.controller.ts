import {
  Controller,
  Get,
  Param,
  ParseArrayPipe,
} from '@nestjs/common';
import { StaffLineService } from 'src/service/staff-line.service';

@Controller('api/staffline')
export class StaffLineController {
  constructor(private staffLineService: StaffLineService) { }

  /* 
    * 地點搜尋
    */
  // 查區域-區經理員工id
  @Get('testDistrictsByDistrictManger/:staffId')
  testDistrictsByDistrictManger(@Param('staffId') staffId: number) {
    return this.staffLineService.testDistrictsByDistrictManger(staffId);
  }

  // 查通訊處-處經理員工id
  @Get('testDeptsByDeptManger/:staffId')
  testDeptsByDeptManger(@Param('staffId') staffId: number) {
    return this.staffLineService.testDeptsByDeptManger(staffId);
  }

  // 查通訊處-區域條件
  @Get('testDeptsByDistrictID/:districtId')
  testDeptsByDistrictID(@Param('districtId') districtId: number) {
    return this.staffLineService.testDeptsByDistrictID(districtId);
  }

  // 查通訊處-多區域條件
  @Get('testDeptsByDistricts/:districtIds')
  testDeptsByDistricts(@Param('districtIds', new ParseArrayPipe({ items: Number, separator: ',' })) districtIds: number[]) {
    return this.staffLineService.testDeptsByDistricts(districtIds);
  }

  /* 
   * 人員搜尋
   */
  // 查區經理-員工id條件
  @Get('testDistrictManagerByStaffId/:staffId')
  testDistrictManagerByStaffId(@Param('staffId') id: number) {
    return this.staffLineService.testDistrictManagerByStaffId(id);
  }

  // 查區經理-單區域條件
  @Get('testDistrictManagerByDistrictId/:districtId')
  testDistrictManagerByDistrictId(@Param('districtId') id: number) {
    return this.staffLineService.testDistrictManagerByDistrictId(id);
  }

  // 查通訊處經理-員工id條件
  @Get('testDeptManagerByStaffId/:staffId')
  testDeptManagerByStaffId(@Param('staffId') staffId: number) {
    return this.staffLineService.testDeptManagerByStaffId(staffId);
  }

  // 查通訊處經理-單一通訊處條件
  @Get('testDeptManagerByDeptId/:deptId')
  testDeptManagerByDeptId(@Param('deptId') deptId: number) {
    return this.staffLineService.testDeptManagerByDeptId(deptId);
  }

  // 查通訊處經理-多通訊處條件
  @Get('test/deptsManager/:deptIds')
  testDeptManagerByDepts(@Param('deptIds', new ParseArrayPipe({ items: Number, separator: ',' })) deptIds: number[]) {
    return this.staffLineService.testDeptManagerByDepts(deptIds);
  }

  // 查通訊處保險員-單通訊處條件
  @Get('testStaffByDeptId/:deptId')
  testStaffByDeptId(@Param('deptId') deptId: number) {
    return this.staffLineService.testStaffByDeptId(deptId);
  }

  // 查通訊處保險員-多通訊處條件
  @Get('testStaffByDepts/:deptIds')
  testStaffByDepts(@Param('deptIds', new ParseArrayPipe({ items: Number, separator: ',' })) deptIds: number[]) {
    return this.staffLineService.testStaffByDepts(deptIds);
  }
}

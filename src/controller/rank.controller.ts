import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { of } from 'rxjs/internal/observable/of';
import { switchMap, take } from 'rxjs/operators';
import { Dept } from 'src/entity/dept';
import { Rank, RankDTO, StaffDTO } from 'src/entity/rank';
import { Staff } from 'src/entity/staff';
import { RankService } from 'src/service/rank.service';
import { StaffService } from 'src/service/staff.service';

@Controller('rank')
export class RankController {
  constructor(
    private rankService: RankService,
    private staffService: StaffService,
  ) {}

  @Get()
  findAll() {
    return this.rankService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rankService.findOne(id);
  }

  @Post('district')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  findByDistrictId(
    @Body('districtId') districtId: number,
    @Body('pageIndex') pageIndex: number,
    @Body('pageSize') pageSize: number,
  ) {
    return this.rankService.findByDistrictId(districtId, pageIndex, pageSize);
  }

  @Post('dept')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  findByDeptId(
    @Body('deptId') deptId: number,
    @Body('pageIndex') pageIndex: number,
    @Body('pageSize') pageSize: number,
  ) {
    return this.rankService.findByDeptId(deptId, pageIndex, pageSize);
  }

  @Post('level')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  findByLevel(
    @Body('level') level: number,
    @Body('pageIndex') pageIndex: number,
    @Body('pageSize') pageSize: number,
  ) {
    return this.rankService.findByLevel(level, pageIndex, pageSize);
  }

  @Post('leveldown')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  findByDeptIdAndLevel(
    @Body('deptId') deptId: number,
    @Body('level') level: number,
    @Body('pageIndex') pageIndex: number,
    @Body('pageSize') pageSize: number,
  ) {
    return this.rankService.findByDeptIdAndLevel(
      deptId,
      level,
      pageIndex,
      pageSize,
    );
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() rankDTO: RankDTO) {
    const s = plainToInstance(Staff, rankDTO);
    return this.staffService.create(s).pipe(
      take(1),
      switchMap((res) => {
        const isSuccess = res?.affect?.success || false;
        if (isSuccess) {
          const p = plainToInstance(Rank, rankDTO);

          p.staff = new Staff();
          p.staff.id = res.affect.id;

          p.dept = new Dept();
          p.dept.id = rankDTO.deptId;
          return this.rankService.create(p);
        }
        // 應該要丟錯誤包
        return of(null);
      }),
    );
  }

  @Put(':id')
  updateStaff(@Param('id') id: number, @Body() staffDTO: StaffDTO) {
    const s = plainToInstance(Staff, staffDTO);
    return this.staffService.update(id, s);
  }
}

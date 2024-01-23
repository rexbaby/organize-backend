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
import { of } from 'rxjs/internal/observable/of';
import { switchMap, take } from 'rxjs/operators';
import { Dept } from 'src/entity/dept';
import { Rank, RankDTO } from 'src/entity/rank';
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
  update(@Param('id') id: number, @Body() rank: Rank) {
    return this.rankService.update(id, rank);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.rankService.delete(id);
  }
}

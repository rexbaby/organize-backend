import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from } from 'rxjs/internal/observable/from';
import { concatMap, map, switchMap, toArray } from 'rxjs/operators';
import { responseByAffect, responseByError } from 'src/core/response.util';
import { Staff } from 'src/entity/staff';
import { Updistrict } from 'src/entity/up-district';
import { Updept } from 'src/entity/up-dept';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class StaffUpService {
  constructor(
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
    @InjectRepository(Updistrict) private updistrictRepository: Repository<Updistrict>,
    @InjectRepository(Updept) private updeptRepository: Repository<Updept>,
  ) { }

  upManager(id: number, areaIds: number[]) {
    // 檢核員工等級
    return from(this.staffRepository.findOne({ where: { id } })).pipe(switchMap((staff) => {
      if (!staff) {
        return of(responseByError({
          code: 'F01',
          message: `Staff with ID:${id} not found`,
          timestamp: new Date().toISOString()
        }))
      }

      switch (staff.level) {
        case 1:// 升處經理：改變staff.level=2
          const s = { ...staff, level: 2 };
          return from(this.staffRepository.update(id, s)).pipe(
            switchMap((res) => {
              if (res.affected > 0) {
                return this.addDeptManager(id, areaIds).pipe(
                  map((addDeptResults) => {
                    const { row, sum } = addDeptResults.reduce((acc, response) => {
                      acc.sum++;
                      if (response.affect.success) {
                        acc.row++;
                      }
                      return acc;
                    }, { row: 0, sum: 0 });
                    return responseByAffect({ success: true, row: row, sum: sum });
                  })
                );
              } else {
                return of(responseByError({
                  code: 'S03',
                  message: `Staff with ID:${id} level update fail`,
                  timestamp: new Date().toISOString()
                }))
              }
            })
          );
        case 2:// 升區經理：處關聯表需要全部刪掉、改變staff.level=3
          const m = { ...staff, level: 3 };
          return from(this.staffRepository.update(id, m)).pipe(
            switchMap((res) => {
              if (res.affected > 0) {
                return this.delDeptManager(id).pipe(
                  switchMap((delDeptManagerReponses) => {
                    if (delDeptManagerReponses.every((response) => response.affect.success)) {
                      return this.addDistrictManager(id, areaIds).pipe(
                        map((addDistrictResults) => {
                          const { row, sum } = addDistrictResults.reduce((acc, response) => {
                            acc.sum++;
                            if (response.affect.success) {
                              acc.row++;
                            }
                            return acc;
                          }, { row: 0, sum: 0 });
                          return responseByAffect({ success: true, row, sum });
                        })
                      );
                    } else { }
                    return of(responseByError({
                      code: 'S03',
                      message: `Failed to delete all department managers for Staff with ID: ${id}`,
                      timestamp: new Date().toISOString()
                    }));
                  }
                  ))
              } else {
                return of(responseByError({
                  code: 'S03',
                  message: `Staff with ID:${id} level update fail`,
                  timestamp: new Date().toISOString()
                }))
              }
            })
          );
        case 3:
          return of(responseByError({
            code: 'S01',
            message: `Staff with ID:${id} level Max`,
            timestamp: new Date().toISOString()
          }))
        default:
          return of(responseByError({
            code: 'F02',
            message: `Staff with ID:${id} error`,
            timestamp: new Date().toISOString()
          }))
      }
    }))
  }

  /* 
   * Test
   */
  // 新增區經理跟區域關聯
  testAddDistrictManager(staffId: number, districtIds: number[]) {
    return this.addDistrictManager(staffId, districtIds);
  }

  private addDistrictManager(staffId: number, areaIds: number[]) {
    return of(...areaIds).pipe(
      concatMap((districtId) => {
        const newDto = this.updistrictRepository.create({
          district: { id: districtId },
          staff: { id: staffId }
        });
        return from(this.updistrictRepository.save(newDto)).pipe(
          map((res) => {
            return responseByAffect({ success: !!res.id, id: res.id })
          })
        );
      }),
      toArray()
    );
  }

  // 新增處經理跟通訊處關聯
  testAddDeptManager(staffId: number, deptIds: number[]) {
    return this.addDeptManager(staffId, deptIds);
  }

  private addDeptManager(staffId: number, deptIds: number[]) {
    return of(...deptIds).pipe(
      concatMap((deptId) => {
        const newDto = this.updeptRepository.create({
          dept: { id: deptId },
          staff: { id: staffId }
        });
        return from(this.updeptRepository.save(newDto)).pipe(
          map((res) => {
            return responseByAffect({ success: !!res.id, id: res.id })
          })
        );
      }),
      toArray()
    );
  }

  // 刪除處經理跟通訊處關聯
  testDelDeptManager(staffId: number) {
    return this.delDeptManager(staffId);
  }

  private delDeptManager(staffId: number) {
    return from(this.updeptRepository.find({ where: { staff: { id: staffId } } }))
      .pipe(
        concatMap((updepts: Updept[]) => of(...updepts)),
        concatMap((updept: Updept) => from(this.updeptRepository.delete(updept))),
        map((res) => responseByAffect({ success: res.affected > 0 })),
        toArray()
      );
  }
}

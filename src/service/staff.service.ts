import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { from } from 'rxjs/internal/observable/from';
import { concatMap, map, switchMap, take, toArray } from 'rxjs/operators';
import { responseByAffect, responseByData, responseByError } from 'src/core/response.util';
import { CreateStaffDTO, Staff, UpdateStaffDTO } from 'src/entity/staff';
import { Updistrict } from 'src/entity/up-district';
import { Updept } from 'src/entity/up-dept';
import { Dept } from 'src/entity/dept';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
    @InjectRepository(Updistrict) private updistrictRepository: Repository<Updistrict>,
    @InjectRepository(Updept) private updeptRepository: Repository<Updept>,
    @InjectRepository(Dept) private deptRepository: Repository<Dept>,
  ) { }

  findAll() {
    return from(this.staffRepository.find({ relations: ['dept'] })).pipe(
      map((res) => responseByData(res)),
    );
  }

  findOne(id: number) {
    return from(this.staffRepository.findOne({
      where: { id: id },
      relations: ['dept']
    })
    ).pipe(map((res) => responseByData(res)));
  }

  create(dto: CreateStaffDTO) {
    const newDto = this.staffRepository.create({
      ...dto,
      status: 1,
      createdBy: 1,
      updatedBy: 1,
      dept: { id: dto.deptId }
    });

    return from(this.staffRepository.save(newDto)).pipe(
      map((res) => responseByAffect({ success: !!res.id, id: res.id }))
    );
  }

  update(id: number, dto: UpdateStaffDTO) {
    const newDto = this.staffRepository.create({
      ...dto,
      updatedBy: 1,
    });

    return from(this.staffRepository.update(id, newDto)).pipe(
      map((res) => responseByAffect({ success: res.affected > 0 }))
    );
  }

  partial(id: number, dto: UpdateStaffDTO) {
    return from(this.staffRepository.findOne({ where: { id } })).pipe(
      switchMap((staff: Staff) => {
        if (!staff) {
          return of(responseByError({
            code: 'F01',
            message: `Staff with ID:${id} not found`,
            timestamp: new Date().toISOString()
          }))
        }
        const newDto = { ...staff, ...dto };

        return from(this.staffRepository.save(newDto)).pipe(
          map(res => responseByAffect({ success: !!res.id, id: res.id }))
        );
      }),
    );
  }

  //  升遷
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

  testAddDistrictManager(id: number, areaIds: number[]) {
    return this.addDistrictManager(id, areaIds);
  }

  private addDistrictManager(id: number, areaIds: number[]) {
    return of(...areaIds).pipe(
      concatMap((districtId) => {
        const newDto = this.updistrictRepository.create({
          district: { id: districtId },
          staff: { id: id }
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

  testAddDeptManager(id: number, areaIds: number[]) {
    return this.addDeptManager(id, areaIds);
  }

  private addDeptManager(id: number, areaIds: number[]) {
    return of(...areaIds).pipe(
      concatMap((deptId) => {
        const newDto = this.updeptRepository.create({
          dept: { id: deptId },
          staff: { id: id }
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

  private delDeptManager(id: number) {
    return from(this.updeptRepository.find({ where: { staff: { id: id } } }))
      .pipe(
        concatMap((updepts: Updept[]) => from(updepts)),
        concatMap((updept: Updept) => this.updeptRepository.remove(updept)),
        map((res) => responseByAffect({ success: !!res.id, id: res.id })),
        toArray()
      );
  }

  // 轄下
  findStaffByDistrict(districtId: number) {
    this.districtManager(districtId).pipe(take(1)).subscribe((districtManagers) => {
      console.log(11, districtManagers);

      this.deptsByDistrict(districtId).pipe(take(1)).subscribe((depts) => {
        console.log(22, depts);

        const deptIds = depts.map((dept) => dept.id)
        this.deptsManager(deptIds).pipe(take(1)).subscribe((deptsManagers) => {
          console.log(33, deptsManagers);

          this.deptsStaff(deptIds).pipe(take(1)).subscribe((deptsStaffs) => {
            console.log(44, deptsStaffs);
          })
        })
      })

    })
  }


  // Test
  testDistrictManager(districtId: number) {
    return this.districtManager(districtId).pipe(
      map((res) => responseByData(res)),
    );
  }

  testDeptsByDistrict(districtId: number) {
    return this.deptsByDistrict(districtId).pipe(
      map((res) => responseByData(res)),
    );
  }

  testDeptsManager(depts: number[]) {
    return this.deptsManager(depts).pipe(
      map((res) => responseByData(res)),
    );
  }

  testDeptManager(deptId: number) {
    return this.deptManager(deptId).pipe(
      map((res) => responseByData(res)),
    );
  }

  testDeptsStaff(depts: number[]) {
    return this.deptsStaff(depts).pipe(
      map((res) => responseByData(res)),
    );
  }

  testDeptStaff(deptId: number) {
    return this.deptStaff(deptId).pipe(
      map((res) => responseByData(res)),
    );
  }

  private districtManager(districtId: number) {
    return from(
      this.updistrictRepository
        .createQueryBuilder()
        .select(['staff.id AS staffId', 'GROUP_CONCAT(district.id) AS districs'])
        .innerJoin('updept.staff', 'staff')
        .innerJoin('updept.district', 'district')
        .where('district.id = :district', { districtId })
        .groupBy('staff.id')
        .getRawMany()
    );
  }

  private deptsByDistrict(districtId: number) {
    return from(
      this.deptRepository.find({
        where: { district: { id: districtId } },
        relations: ['district'],
      }))
  }

  private deptsManager(depts: number[]) {
    return from(
      this.updeptRepository
        .createQueryBuilder()
        .select(['staff.id AS staffId', 'GROUP_CONCAT(dept.id) AS depts'])
        .innerJoin('updept.staff', 'staff')
        .innerJoin('updept.dept', 'dept')
        .where('dept.id IN (:...depts)', { depts })
        .groupBy('staff.id')
        .getRawMany()
    )
  }

  private deptManager(deptId: number) {
    return from(
      this.updeptRepository
        .createQueryBuilder()
        .select(['staff.id AS staffId', 'GROUP_CONCAT(dept.id) AS depts'])
        .innerJoin('updept.staff', 'staff')
        .innerJoin('updept.dept', 'dept')
        .where('dept.id = :deptId', { deptId })
        .groupBy('staff.id')
        .getRawMany()
    )
  }

  private deptsStaff(depts: number[]) {
    return from(this.staffRepository.find({ where: { dept: { id: In(depts) }, level: 1 } }))
  }

  private deptStaff(deptId: number) {
    return from(this.staffRepository.find({ where: { dept: { id: deptId }, level: 1 } }))
  }
}

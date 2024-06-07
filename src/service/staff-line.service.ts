import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { from } from 'rxjs/internal/observable/from';
import { concatMap, map, toArray } from 'rxjs/operators';
import { responseByData } from 'src/core/response.util';
import { Staff } from 'src/entity/staff';
import { Updistrict } from 'src/entity/up-district';
import { Updept } from 'src/entity/up-dept';
import { Dept } from 'src/entity/dept';
import { of } from 'rxjs/internal/observable/of';

interface IStaffDept {
  id: number,
  name: string,
  gender: number,
  phone: string,
  boardOn: string,
  level: number,
  status: number,
  createdOn: string,
  createdBy: number,
  updatedOn: string,
  updatedBy: number,
  depts: IDept[]
}

interface IDept {
  id: number,
  name: string,
  phone: string,
  address: string,
  status: number,
  createdOn: string,
  createdBy: number,
  updatedOn: string,
  updatedBy: number,
}

@Injectable()
export class StaffLineService {
  constructor(
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
    @InjectRepository(Updistrict) private updistrictRepository: Repository<Updistrict>,
    @InjectRepository(Updept) private updeptRepository: Repository<Updept>,
    @InjectRepository(Dept) private deptRepository: Repository<Dept>,
  ) { }

  /* 
   * 轄下流程
   */
  findStaffByDistrict(districtId: number) {
    // this.districtManagerByStaffId(districtId).pipe(take(1)).subscribe((districtManagers) => {
    //   console.log(11, districtManagers);

    //   this.deptsByDistrict(districtId).pipe(take(1)).subscribe((depts) => {
    //     console.log(22, depts);

    //     const deptIds = depts.map((dept) => dept.id)
    //     this.deptsManager(deptIds).pipe(take(1)).subscribe((deptsManagers) => {
    //       console.log(33, deptsManagers);

    //       this.deptsStaff(deptIds).pipe(take(1)).subscribe((deptsStaffs) => {
    //         console.log(44, deptsStaffs);
    //       })
    //     })
    //   })

    // })
  }

  /* 
   * 地點搜尋Test
   */
  // 查區域-區經理員工id
  testDistrictsByDistrictManger(staffId: number) {
    return this.districtsByDistrictManger(staffId).pipe(
      map((res) => responseByData(res))
    );
  }

  private districtsByDistrictManger(staffId: number) {
    return from(this.updistrictRepository.find({ where: { staff: { id: staffId } }, relations: ['district'] })).pipe(
      map((updistricts: Updistrict[]) => {
        return updistricts.map((updistrict) => updistrict.district.id)
      }))
  }

  // 查通訊處-處經理員工id
  testDeptsByDeptManger(staffId: number) {
    return this.deptsByDeptManger(staffId).pipe(
      map((res) => responseByData(res))
    );
  }

  private deptsByDeptManger(staffId: number) {
    return from(this.updeptRepository.find({ where: { staff: { id: staffId } }, relations: ['dept'] })).pipe(
      map((updepts: Updept[]) => {
        return updepts.map((updept) => updept.dept.id)
      }))
  }

  // 查通訊處-區域條件
  testDeptsByDistrictID(districtId: number) {
    return this.deptsByDistrictId(districtId).pipe(
      map((res) => responseByData(res))
    );
  }

  private deptsByDistrictId(districtId: number) {
    return from(
      this.deptRepository.find({
        where: { district: { id: districtId } },
        relations: ['district'],
      }))
  }

  // 查通訊處-多區域條件
  testDeptsByDistricts(districtIds: number[]) {
    return this.deptsByDistricts(districtIds).pipe(
      map((res) => responseByData(res))
    );
  }

  private deptsByDistricts(districtIds: number[]) {
    return from(this.deptRepository.find({ where: { district: { id: In(districtIds) } }, relations: ['district'] }))
  }

  /* 
   * 人員搜尋Test
   */
  // 查區經理-員工id條件
  testDistrictManagerByStaffId(staffId: number) {
    return this.districtManagerByStaffId(staffId).pipe(
      map((res) => responseByData(res))
    );
  }

  private districtManagerByStaffId(staffId: number) {
    const mergedData = {};

    return from(
      this.updistrictRepository
        .createQueryBuilder()
        .leftJoinAndSelect('Updistrict.staff', 'Staff')
        .leftJoinAndSelect('Updistrict.district', 'District')
        .where('Updistrict.staffId = :staffId', { staffId })
        .getMany()
    ).pipe(
      map((res) => {
        res.forEach(item => {
          if (mergedData[item.staff.id]) {
            mergedData[item.staff.id].districts.push(item.district);
          } else {
            mergedData[item.staff.id] = {
              ...item.staff,
              districts: [item.district],
            };
          }
        });
        return Object.values(mergedData)[0];
      }))
  }

  // 查區經理-單區域條件
  testDistrictManagerByDistrictId(districtId: number) {
    return this.districtManagerByDistrictId(districtId).pipe(
      map((res) => responseByData(res))
    );
  }

  private districtManagerByDistrictId(districtId: number) {
    return from(this.updistrictRepository.find({
      where: { district: { id: districtId } }, relations: ['staff']
    })).pipe(
      concatMap((upDistricts: Updistrict[]) => of(...upDistricts)),
      concatMap((upDistrict) => this.districtManagerByStaffId(upDistrict.staff.id)),
      toArray()
    );
  }

  // 查通訊處經理-員工id條件
  testDeptManagerByStaffId(staffId: number) {
    return this.deptManagerByStaffId(staffId).pipe(
      map((res) => responseByData(res))
    );
  }

  private deptManagerByStaffId(staffId: number) {
    const mergedData = {};

    return from(
      this.updeptRepository
        .createQueryBuilder()
        .leftJoinAndSelect('Updept.staff', 'Staff')
        .leftJoinAndSelect('Updept.dept', 'Dept')
        .where('Updept.staffId = :staffId', { staffId })
        .getMany()
    ).pipe(
      map((res) => {
        res.forEach(item => {
          if (mergedData[item.staff.id]) {
            mergedData[item.staff.id].depts.push(item.dept);
          } else {
            mergedData[item.staff.id] = {
              ...item.staff,
              depts: [item.dept],
            };
          }
        });
        return Object.values(mergedData)[0];
      }))
  }

  // 查通訊處經理-單一通訊處條件
  testDeptManagerByDeptId(deptId: number) {
    return this.deptManagerByDeptId(deptId).pipe(
      map((res) => responseByData(res))
    );
  }

  private deptManagerByDeptId(deptId: number) {
    return from(this.updeptRepository.find({
      where: { dept: { id: deptId } }, relations: ['staff']
    })).pipe(
      concatMap((updepts: Updept[]) => of(...updepts)),
      concatMap((updept) => this.deptManagerByStaffId(updept.staff.id)),
      toArray()
    );
  }

  // 查通訊處經理-多通訊處條件
  testDeptManagerByDepts(deptIds: number[]) {
    return this.deptManagerByDepts(deptIds).pipe(
      map((res) => responseByData(res))
    );
  }

  private deptManagerByDepts(deptIds: number[]) {
    return of(...deptIds).pipe(
      concatMap(deptId => this.deptManagerByDeptId(deptId)),
      toArray(),
      map((results: IStaffDept[][]) => {
        let mergedResults: IStaffDept[] = [];
        results.forEach(result => {
          if (result.length) mergedResults = mergedResults.concat(result);
        });
        return mergedResults;
      }),
      map((res: IStaffDept[]) => {
        const uniqueResults = res.reduce((acc, curr) => {
          const existingItem = acc.find(item => item.id === curr.id);
          if (!existingItem) {
            return [...acc, curr];
          }
          return acc;
        }, []);
        return uniqueResults;
      })
    )
  }

  // 查通訊處保險員-單通訊處條件
  testStaffByDeptId(deptId: number) {
    return this.staffByDeptId(deptId).pipe(
      map((res) => responseByData(res))
    );
  }

  private staffByDeptId(deptId: number) {
    return from(this.staffRepository.find({ where: { dept: { id: deptId }, level: 1 } }))
  }

  // 查通訊處保險員-多通訊處條件
  testStaffByDepts(deptIds: number[]) {
    return this.staffByDepts(deptIds).pipe(
      map((res) => responseByData(res))
    );
  }

  private staffByDepts(deptIds: number[]) {
    return from(this.staffRepository.find({ where: { dept: { id: In(deptIds) }, level: 1 } }))
  }
}

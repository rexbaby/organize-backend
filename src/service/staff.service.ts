import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from } from 'rxjs/internal/observable/from';
import { map, switchMap } from 'rxjs/operators';
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
}

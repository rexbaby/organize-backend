import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from } from 'rxjs/internal/observable/from';
import { map, switchMap } from 'rxjs/operators';
import { responseByAffect, responseByData, responseByError } from 'src/core/response.util';
import { CreateDeptDTO, Dept, UpdateDeptDTO } from 'src/entity/dept';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Dept) private deptRepository: Repository<Dept>,
  ) { }

  findAll() {
    return from(this.deptRepository.find({ relations: ['district'] })).pipe(
      map((res) => responseByData(res)),
    );
  }

  findOne(id: number) {
    return from(
      this.deptRepository.findOne({
        where: { id: id },
        relations: ['district'],
      })
    ).pipe(map((res) => responseByData(res)));
  }

  findAllByDistrict(districtId: number) {
    return from(
      this.deptRepository.find({
        where: { district: { id: districtId } },
        relations: ['district'],
      }),
    ).pipe(map((res) => responseByData(res)));
  }

  create(dto: CreateDeptDTO) {
    const newDto = this.deptRepository.create({
      ...dto,
      status: 1,
      createdBy: 1,
      updatedBy: 1,
      district: { id: dto.districtId }
    });

    return from(this.deptRepository.save(newDto)).pipe(
      map(res => responseByAffect({ success: !!res.id, id: res.id })),
    );
  }

  update(id: number, dto: UpdateDeptDTO) {
    const newDto = this.deptRepository.create({
      ...dto,
      updatedBy: 1,
    });

    return from(this.deptRepository.update(id, newDto)).pipe(
      map((res) => responseByAffect({ success: res.affected > 0 })),
    );
  }

  partial(id: number, dto: UpdateDeptDTO) {
    return from(this.deptRepository.findOne({ where: { id } })).pipe(
      switchMap((dept: Dept) => {
        if (!dept) {
          return of(responseByError({
            code: 'F01',
            message: `Dept with ID:${id} not found`,
            timestamp: new Date().toISOString()
          }))
        }
        const newDto = { ...dept, ...dto };

        return from(this.deptRepository.save(newDto)).pipe(
          map(res => responseByAffect({ success: !!res.id, id: res.id })),
        );
      }),
    );
  }
}

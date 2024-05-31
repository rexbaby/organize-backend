import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from } from 'rxjs/internal/observable/from';
import { map, switchMap } from 'rxjs/operators';
import { responseByAffect, responseByData } from 'src/core/response.util';
import { CreateStaffDTO, Staff, UpdateStaffDTO } from 'src/entity/staff';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  findAll() {
    return from(this.staffRepository.find()).pipe(
      map((res) => responseByData(res)),
    );
  }

  findOne(id: number) {
    return from(this.staffRepository.findOne({ where: { id: id } })).pipe(
      map((res) => responseByData(res)),
    );
  }

  create(dto: CreateStaffDTO) {
    const newDto = this.staffRepository.create({
      ...dto,
      status: 1,
      createdBy: 1,
      updatedBy: 1,
    });

    return from(this.staffRepository.save(newDto)).pipe(
      map((res) => responseByAffect({ success: !!res.id, id: res.id })),
    );
  }

  update(id: number, dto: UpdateStaffDTO) {
    const newDto = this.staffRepository.create({
      ...dto,
      updatedBy: 1,
    });

    return from(this.staffRepository.update(id, newDto)).pipe(
      map((res) => responseByAffect({ success: res.affected > 0 })),
    );
  }

  partial(id: number, dto: UpdateStaffDTO) {
    return from(this.staffRepository.findOne({ where: { id } })).pipe(
      switchMap((staff: Staff) => {
        if (!staff) {
          throw new Error(`Dept with ID ${id} not found`);
        }
        const newDto = { ...staff, ...dto };

        return from(this.staffRepository.save(newDto)).pipe(
          map(res => responseByAffect({ success: !!res.id, id: res.id })),
        );
      }),
    );
  }

  delete(id: number) {
    return from(this.staffRepository.delete(id)).pipe(
      map((res) => responseByAffect({ success: res.affected > 0 })),
    );
  }
}

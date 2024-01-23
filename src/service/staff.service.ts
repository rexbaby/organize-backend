import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from } from 'rxjs/internal/observable/from';
import { map } from 'rxjs/operators';
import { responseByAffect, responseByData } from 'src/core/response.util';
import { Staff } from 'src/entity/staff';

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

  create(staff: Staff) {
    return from(this.staffRepository.save(staff)).pipe(
      map((res) => responseByAffect({ success: !!res.id, id: res.id })),
    );
  }

  update(id: number, staff: Staff) {
    return from(this.staffRepository.update(id, staff)).pipe(
      map((res) => responseByAffect({ success: res.affected > 0 })),
    );
  }

  delete(id: number) {
    return from(this.staffRepository.delete(id)).pipe(
      map((res) => responseByAffect({ success: res.affected > 0 })),
    );
  }
}

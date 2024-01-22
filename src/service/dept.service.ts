import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from } from 'rxjs/internal/observable/from';
import { map } from 'rxjs/operators';
import { responseByAffect, responseByData } from 'src/core/response.util';
import { Dept } from 'src/entity/dept';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Dept)
    private deptRepository: Repository<Dept>,
  ) {}

  findAll() {
    return from(this.deptRepository.find({ relations: ['district'] })).pipe(
      map((res) => responseByData(res)),
    );
  }

  findOne(id: number) {
    return from(this.deptRepository.findOne({ where: { id: id } })).pipe(
      map((res) => responseByData(res)),
    );
  }

  create(dept: Dept) {
    return from(this.deptRepository.save(dept)).pipe(
      map((res) => responseByAffect({ success: !!res.id, id: res.id })),
    );
  }

  update(id: number, dept: Dept) {
    return from(this.deptRepository.update(id, dept)).pipe(
      map((res) => responseByAffect({ success: res.affected > 0 })),
    );
  }

  delete(id: number) {
    return from(this.deptRepository.delete(id)).pipe(
      map((res) => responseByAffect({ success: res.affected > 0 })),
    );
  }
}

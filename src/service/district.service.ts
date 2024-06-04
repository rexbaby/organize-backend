import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from } from 'rxjs/internal/observable/from';
import { map } from 'rxjs/operators';
import { responseByAffect, responseByData } from 'src/core/response.util';
import { CreateDistrictDTO, District, UpdateDistrictDTO } from 'src/entity/district';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private districtRepository: Repository<District>,
  ) {}

  findAll() {
    return from(this.districtRepository.find()).pipe(
      map((res) => responseByData(res)),
    );
  }

  findOne(id: number) {
    return from(this.districtRepository.findOne({ where: { id: id } })).pipe(
      map((res) => responseByData(res)),
    );
  }

  create(dto: CreateDistrictDTO) {
    const newDto = this.districtRepository.create({
      ...dto,
      status: 1,
    });

    return from(this.districtRepository.save(newDto)).pipe(
      map((res) => responseByAffect({ success: !!res.id, id: res.id })),
    );
  }

  update(id: number, dto: UpdateDistrictDTO) {
    return from(this.districtRepository.update(id, dto)).pipe(
      map((res) => responseByAffect({ success: res.affected > 0 })),
    );
  }
}

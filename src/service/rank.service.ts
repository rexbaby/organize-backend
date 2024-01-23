import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from } from 'rxjs/internal/observable/from';
import { map } from 'rxjs/operators';
import { responseByAffect, responseByData } from 'src/core/response.util';
import { Rank } from 'src/entity/rank';

@Injectable()
export class RankService {
  constructor(
    @InjectRepository(Rank)
    private rankRepository: Repository<Rank>,
  ) {}

  findAll() {
    return from(
      this.rankRepository.find({ relations: ['staff', 'dept'] }),
    ).pipe(map((res) => responseByData(res)));
  }

  findOne(id: number) {
    return from(
      this.rankRepository.findOne({
        where: { id: id },
        relations: ['staff', 'dept'],
      }),
    ).pipe(map((res) => responseByData(res)));
  }

  create(rank: Rank) {
    return from(this.rankRepository.save(rank)).pipe(
      map((res) => responseByAffect({ success: !!res.id, id: res.id })),
    );
  }

  update(id: number, rank: Rank) {
    return from(this.rankRepository.update(id, rank)).pipe(
      map((res) => responseByAffect({ success: res.affected > 0 })),
    );
  }

  delete(id: number) {
    return from(this.rankRepository.delete(id)).pipe(
      map((res) => responseByAffect({ success: res.affected > 0 })),
    );
  }
}

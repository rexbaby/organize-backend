import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Staff } from './staff';
import { District } from './district';

export class CreateUpdistrictDTO {
  @IsNotEmpty()
  public readonly districtId: number;

  @IsNotEmpty()
  public readonly staffId: number;
}

@Entity()
export class Updistrict {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'districtId' })
  district: District;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'staffId' })
  staff: Staff;
}

import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Staff } from './staff';
import { Dept } from './dept';

export class StaffDTO {
  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  public readonly status: number;

  @IsNotEmpty()
  public readonly createdBy: number;

  @IsNotEmpty()
  public readonly updatedBy: number;
}

export class RankDTO extends StaffDTO {
  @IsNotEmpty()
  public readonly level: number;

  @IsNotEmpty()
  public readonly deptId: number;
}

@Entity()
export class Rank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  level: number;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'staffId' })
  staff: Staff;

  @ManyToOne(() => Dept)
  @JoinColumn({ name: 'deptId' })
  dept: Dept;
}

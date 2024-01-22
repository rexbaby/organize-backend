import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { District } from './district';

export class DeptDTO {
  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  public readonly status: number;

  @IsNotEmpty()
  public readonly districtId: number;

  @IsNotEmpty()
  public readonly createdBy: number;

  @IsNotEmpty()
  public readonly updatedBy: number;
}

@Entity()
export class Dept {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

  @Column({ default: 1 })
  status: number;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'districtId' })
  district: District;

  @Column()
  @UpdateDateColumn()
  createdOn: Date;

  @Column({ default: 1 })
  createdBy: number;

  @Column()
  @UpdateDateColumn()
  updatedOn: Date;

  @Column({ default: 1 })
  updatedBy: number;
}

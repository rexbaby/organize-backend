import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { District } from './district';

export class CreateDeptDTO {
  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  public readonly phone: string;

  @IsNotEmpty()
  public readonly address: string;

  @IsNotEmpty()
  public readonly districtId: number;
}

export class UpdateDeptDTO {
  @IsOptional()
  public readonly name?: string;

  @IsOptional()
  public readonly phone?: string;

  @IsOptional()
  public readonly address?: string;

  @IsOptional()
  public readonly status: number;
}

@Entity()
export class Dept {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  address: string;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'districtId' })
  district: District;

  @Column({ default: 1 })
  status: number;

  @Column()
  @UpdateDateColumn({ update: false })
  createdOn: Date;

  @Column({ default: 1 })
  createdBy: number;

  @Column()
  @UpdateDateColumn()
  updatedOn: Date;

  @Column({ default: 1 })
  updatedBy: number;
}

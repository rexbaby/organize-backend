import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dept } from './dept';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStaffDTO {
  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  public readonly gender: number;

  @IsNotEmpty()
  public readonly phone: string;

  @IsNotEmpty()
  public readonly boardOn: Date;

  @IsNotEmpty()
  public readonly deptId: number;
}

export class UpdateStaffDTO {
  @IsOptional()
  public readonly name?: string;

  @IsOptional()
  public readonly gender?: number;

  @IsOptional()
  public readonly phone?: string;

  @IsOptional()
  public readonly boardOn?: Date;

  @IsOptional()
  public readonly status: number;
}

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

  @Column({ default: 1 })
  gender: number;

  @Column({ default: '' })
  phone: string;

  @Column()
  @UpdateDateColumn()
  boardOn: Date;

  @ManyToOne(() => Dept)
  @JoinColumn({ name: 'deptId' })
  dept: Dept;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 1 })
  status: number;

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

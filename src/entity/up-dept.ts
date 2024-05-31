import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Dept } from './dept';
import { Staff } from './staff';

export class CreateUpdeptDTO {
  @IsNotEmpty()
  public readonly deptId: number;

  @IsNotEmpty()
  public readonly staffId: number;
}

@Entity()
export class Updept {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Dept)
  @JoinColumn({ name: 'deptId' })
  dept: Dept;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'staffId' })
  staff: Staff;
}

import { IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class DistrictDTO {
  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  public readonly status: number;
}

@Entity()
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

  @Column({ default: 1 })
  status: number;
}

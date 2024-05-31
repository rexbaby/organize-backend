import { IsNotEmpty, IsOptional } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class CreateDistrictDTO {
  @IsNotEmpty()
  public readonly name: string;
}

export class UpdateDistrictDTO {
  @IsNotEmpty()
  public readonly name: string;

  @IsOptional()
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

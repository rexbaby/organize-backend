import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

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

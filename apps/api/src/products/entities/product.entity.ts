import {
  Column,
  Entity,
  ManyToOne, PrimaryGeneratedColumn,
  TableInheritance
} from 'typeorm';
import { Organisation } from '../../organisations/entities/organisation.entity';
import { MeasurementUnit } from '../enums/measurementUnit.enum';

@Entity()
@TableInheritance({
  column: {
    type: 'varchar',
    name: 'type',
  },
})
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  skuCode: string;

  @Column({
    type: 'enum',
    enum: MeasurementUnit,
  })
  unit?: MeasurementUnit;

  @Column()
  unitPrice: number;

  @Column()
  lotQuantity: number;

  @Column()
  type: string;

  @Column({ nullable: true })
  expiry: number;

  @ManyToOne(() => Organisation, (organisation) => organisation.rawMaterials)
  organisation: Organisation;
}

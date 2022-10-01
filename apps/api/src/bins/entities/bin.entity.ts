import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BatchLineItem } from '../../batch-line-items/entities/batch-line-item.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';

@Entity()
export class Bin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column()
  currentCapacity: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.bins)
  warehouse: Warehouse;

  @OneToMany(() => BatchLineItem, (batchLineItem) => batchLineItem.bin)
  batchLineItems: BatchLineItem[];
}

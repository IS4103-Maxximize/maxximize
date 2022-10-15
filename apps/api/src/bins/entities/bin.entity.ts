import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BatchLineItem } from '../../batch-line-items/entities/batch-line-item.entity';
import { Rack } from '../../racks/entities/rack.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';

@Entity()
export class Bin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  volumetricSpace: number;

  @Column()
  currentCapacity: number;

  @OneToMany(() => BatchLineItem, (batchLineItem) => batchLineItem.bin)
  batchLineItems: BatchLineItem[];

  @ManyToOne(() => Rack, (rack) => rack.bins)
  rack: Rack;
}

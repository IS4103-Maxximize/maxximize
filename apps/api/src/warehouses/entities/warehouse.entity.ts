import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Batch } from '../../batches/entities/batch.entity';
import { Organisation } from '../../organisations/entities/organisation.entity';

@Entity()
export class Warehouse {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    address: string;

    @ManyToOne(() => Organisation, (organisation) => organisation.warehouses, {
        onDelete: 'CASCADE'
    })
    organisation: Organisation;

    @OneToMany(() => Batch, (batch) => batch.warehouse)
    batches: Batch[];
}

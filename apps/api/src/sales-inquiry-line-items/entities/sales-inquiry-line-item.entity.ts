import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FinalGood } from '../../final-goods/entities/final-good.entity';
import { RawMaterial } from '../../raw-materials/entities/raw-material.entity';
import { SalesInquiry } from '../../sales-inquiry/entities/sales-inquiry.entity';

@Entity()
export class SalesInquiryLineItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  indicativePrice: number;

  @ManyToOne(() => RawMaterial)
  rawMaterial: RawMaterial;

  @ManyToOne(
    () => SalesInquiry,
    (salesInquiry) => salesInquiry.salesInquiryLineItems,
    { onDelete: 'CASCADE' }
  )
  salesInquiry: SalesInquiry;

  @Column({nullable: true})
  finalGoodId: number
  @ManyToOne(() => FinalGood)
  @JoinColumn({name: 'finalGoodId'})
  finalGood: FinalGood
}

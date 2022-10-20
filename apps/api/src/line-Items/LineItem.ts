import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../products/entities/product.entity';

export abstract class LineItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  subTotal: number;

  @Column()
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 5,
    nullable: true,
  })
  unitOfVolumetricSpace: number;

  @ManyToOne(() => Product)
  product: Product;
}

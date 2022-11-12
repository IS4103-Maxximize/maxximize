import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchLineItemsModule } from '../batch-line-items/batch-line-items.module';
import { BillOfMaterialsModule } from '../bill-of-materials/bill-of-materials.module';
import { BillOfMaterial } from '../bill-of-materials/entities/bill-of-material.entity';
import { InvoicesModule } from '../invoices/invoices.module';
import { Organisation } from '../organisations/entities/organisation.entity';
import { Product } from '../products/entities/product.entity';
import { FinalGood } from './entities/final-good.entity';
import { FinalGoodsController } from './final-goods.controller';
import { FinalGoodsService } from './final-goods.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FinalGood,
      Product,
      BillOfMaterial,
      Organisation,
    ]),
    forwardRef(() => InvoicesModule),
    HttpModule,
    BillOfMaterialsModule,
    BatchLineItemsModule,
  ],
  controllers: [FinalGoodsController],
  providers: [FinalGoodsService],
  exports: [FinalGoodsService],
})
export class FinalGoodsModule {}

import { Module } from '@nestjs/common';
import { FinalGoodsService } from './final-goods.service';
import { FinalGoodsController } from './final-goods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinalGood } from './entities/final-good.entity';
import { Product } from '../products/entities/product.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import { BillOfMaterial } from '../bill-of-materials/entities/bill-of-material.entity';
import { Organisation } from '../organisations/entities/organisation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinalGood, Product, BillOfMaterial, Organisation])],
  controllers: [FinalGoodsController],
  providers: [FinalGoodsService]
})
export class FinalGoodsModule {}

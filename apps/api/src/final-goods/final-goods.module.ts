import { Module } from '@nestjs/common';
import { FinalGoodsService } from './final-goods.service';
import { FinalGoodsController } from './final-goods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinalGood } from './entities/final-good.entity';
import { Product } from '../products/entities/product.entity';
import { Recipe } from '../recipes/entities/recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinalGood, Product, Recipe])],
  controllers: [FinalGoodsController],
  providers: [FinalGoodsService]
})
export class FinalGoodsModule {}

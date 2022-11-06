import { Module } from '@nestjs/common';
import { CartLineItemsService } from './cart-line-items.service';
import { CartLineItemsController } from './cart-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartLineItem } from './entities/cart-line-item.entity';
import { CartsModule } from '../carts/carts.module';
import { FinalGoodsModule } from '../final-goods/final-goods.module';

@Module({
  imports: [TypeOrmModule.forFeature([CartLineItem]), FinalGoodsModule, CartsModule],
  controllers: [CartLineItemsController],
  providers: [CartLineItemsService],
  exports: [CartLineItemsService]
})
export class CartLineItemsModule {}

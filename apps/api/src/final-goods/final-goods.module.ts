import { Module } from '@nestjs/common';
import { FinalGoodsService } from './final-goods.service';
import { FinalGoodsController } from './final-goods.controller';

@Module({
  controllers: [FinalGoodsController],
  providers: [FinalGoodsService]
})
export class FinalGoodsModule {}

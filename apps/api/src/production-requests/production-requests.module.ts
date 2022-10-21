import { forwardRef, Module } from '@nestjs/common';
import { ProductionRequestsService } from './production-requests.service';
import { ProductionRequestsController } from './production-requests.controller';
import { ProductionRequest } from './entities/production-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { FinalGoodsModule } from '../final-goods/final-goods.module';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionRequest]), forwardRef(() => PurchaseOrdersModule), forwardRef(() => FinalGoodsModule)],
  controllers: [ProductionRequestsController],
  providers: [ProductionRequestsService],
  exports: [ProductionRequestsService]
})
export class ProductionRequestsModule {}

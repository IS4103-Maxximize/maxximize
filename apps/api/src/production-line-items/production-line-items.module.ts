import { Module } from '@nestjs/common';
import { ProductionLineItemsService } from './production-line-items.service';
import { ProductionLineItemsController } from './production-line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionLineItem } from './entities/production-line-item.entity';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionLineItem, BatchLineItem, RawMaterial])],
  controllers: [ProductionLineItemsController],
  providers: [ProductionLineItemsService],
})
export class ProductionLineItemsModule {}
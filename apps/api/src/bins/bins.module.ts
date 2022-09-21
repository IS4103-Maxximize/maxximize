import { Module } from '@nestjs/common';
import { BinsService } from './bins.service';
import { BinsController } from './bins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bin } from './entities/bin.entity';
import { Warehouse } from '../warehouses/entities/warehouse.entity';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { WarehousesModule } from '../warehouses/warehouses.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bin, Warehouse, BatchLineItem]), WarehousesModule],
  controllers: [BinsController],
  providers: [BinsService],
  exports: [BinsService]
})
export class BinsModule {}

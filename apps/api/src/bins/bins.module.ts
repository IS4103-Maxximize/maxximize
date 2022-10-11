import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchLineItem } from '../batch-line-items/entities/batch-line-item.entity';
import { RacksModule } from '../racks/racks.module';
import { Warehouse } from '../warehouses/entities/warehouse.entity';
import { WarehousesModule } from '../warehouses/warehouses.module';
import { BinsController } from './bins.controller';
import { BinsService } from './bins.service';
import { Bin } from './entities/bin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bin, Warehouse, BatchLineItem]), WarehousesModule, RacksModule],
  controllers: [BinsController],
  providers: [BinsService],
  exports: [BinsService]
})
export class BinsModule {}

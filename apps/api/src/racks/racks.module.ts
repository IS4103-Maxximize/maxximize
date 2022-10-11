import { Module } from '@nestjs/common';
import { RacksService } from './racks.service';
import { RacksController } from './racks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rack } from './entities/rack.entity';
import { Warehouse } from '../warehouses/entities/warehouse.entity';
import { Bin } from '../bins/entities/bin.entity';
import { WarehousesModule } from '../warehouses/warehouses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rack, Warehouse, Bin]), 
    WarehousesModule
  ],
  controllers: [RacksController],
  providers: [RacksService],
  exports: [RacksService]
})
export class RacksModule {}

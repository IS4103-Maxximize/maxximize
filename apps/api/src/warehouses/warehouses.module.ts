import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Batch } from '../batches/entities/batch.entity';
import { Organisation } from '../organisations/entities/organisation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, Batch, Organisation])],
  controllers: [WarehousesController],
  providers: [WarehousesService]
})
export class WarehousesModule {}

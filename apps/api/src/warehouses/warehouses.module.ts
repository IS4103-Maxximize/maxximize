import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Batch } from '../batches/entities/batch.entity';
import { Organisation } from '../organisations/entities/organisation.entity';
import { OrganisationsModule } from '../organisations/organisations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, Batch, Organisation]), OrganisationsModule],
  controllers: [WarehousesController],
  providers: [WarehousesService],
  exports: [WarehousesService]
})
export class WarehousesModule {}

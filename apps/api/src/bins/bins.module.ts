import { Module } from '@nestjs/common';
import { BinsService } from './bins.service';
import { BinsController } from './bins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bin } from './entities/bin.entity';
import { Warehouse } from '../warehouses/entities/warehouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bin, Warehouse])],
  controllers: [BinsController],
  providers: [BinsService]
})
export class BinsModule {}

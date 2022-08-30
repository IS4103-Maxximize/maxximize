import { Module } from '@nestjs/common';
import { BillOfMaterialsService } from './bill-of-materials.service';
import { BillOfMaterialsController } from './bill-of-materials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillOfMaterial } from './entities/bill-of-material.entity';
import { BomLineItem } from '../bom-line-items/entities/bom-line-item.entity';
import { OrderProcess } from '../order-processes/entities/order-process.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillOfMaterial, BomLineItem, OrderProcess])],
  controllers: [BillOfMaterialsController],
  providers: [BillOfMaterialsService]
})
export class BillOfMaterialsModule {}

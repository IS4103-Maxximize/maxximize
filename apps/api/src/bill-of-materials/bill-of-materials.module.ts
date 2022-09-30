import { Module } from '@nestjs/common';
import { BillOfMaterialsService } from './bill-of-materials.service';
import { BillOfMaterialsController } from './bill-of-materials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillOfMaterial } from './entities/bill-of-material.entity';
import { BomLineItem } from '../bom-line-items/entities/bom-line-item.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { ProductionOrder } from '../production-orders/entities/production-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillOfMaterial, BomLineItem, RawMaterial, ProductionOrder])],
  controllers: [BillOfMaterialsController],
  providers: [BillOfMaterialsService],
  exports: [BillOfMaterialsService]
})
export class BillOfMaterialsModule {}

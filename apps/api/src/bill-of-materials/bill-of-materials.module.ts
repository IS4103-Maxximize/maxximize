import { Module } from '@nestjs/common';
import { BillOfMaterialsService } from './bill-of-materials.service';
import { BillOfMaterialsController } from './bill-of-materials.controller';

@Module({
  controllers: [BillOfMaterialsController],
  providers: [BillOfMaterialsService]
})
export class BillOfMaterialsModule {}

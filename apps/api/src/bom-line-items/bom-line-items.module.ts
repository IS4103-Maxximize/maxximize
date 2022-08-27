import { Module } from '@nestjs/common';
import { BomLineItemsService } from './bom-line-items.service';
import { BomLineItemsController } from './bom-line-items.controller';

@Module({
  controllers: [BomLineItemsController],
  providers: [BomLineItemsService]
})
export class BomLineItemsModule {}

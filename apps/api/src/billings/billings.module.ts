import { Module } from '@nestjs/common';
import { BillingsService } from './billings.service';
import { BillingsController } from './billings.controller';

@Module({
  controllers: [BillingsController],
  providers: [BillingsService]
})
export class BillingsModule {}

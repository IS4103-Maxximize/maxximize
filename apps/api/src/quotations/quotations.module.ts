import { Module } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { QuotationsController } from './quotations.controller';

@Module({
  controllers: [QuotationsController],
  providers: [QuotationsService]
})
export class QuotationsModule {}

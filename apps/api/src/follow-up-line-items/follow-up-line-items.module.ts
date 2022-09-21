import { Module } from '@nestjs/common';
import { FollowUpLineItemsService } from './follow-up-line-items.service';
import { FollowUpLineItemsController } from './follow-up-line-items.controller';

@Module({
  controllers: [FollowUpLineItemsController],
  providers: [FollowUpLineItemsService],
})
export class FollowUpLineItemsModule {}

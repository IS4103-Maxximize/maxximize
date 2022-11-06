import { Module } from '@nestjs/common';
import { BulkDiscountRangesService } from './bulk-discount-ranges.service';
import { BulkDiscountRangesController } from './bulk-discount-ranges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkDiscountRange } from './entities/bulk-discount-range.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BulkDiscountRange])],
  controllers: [BulkDiscountRangesController],
  providers: [BulkDiscountRangesService],
  exports: [BulkDiscountRangesService]
})
export class BulkDiscountRangesModule {}

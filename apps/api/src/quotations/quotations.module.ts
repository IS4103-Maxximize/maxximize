import { Module } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { QuotationsController } from './quotations.controller';
import { Quotation } from './entities/quotation.entity';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ShellOrganisation, Quotation])],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService]
})
export class QuotationsModule {}

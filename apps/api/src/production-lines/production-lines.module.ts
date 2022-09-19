import { Module } from '@nestjs/common';
import { ProductionLinesService } from './production-lines.service';
import { ProductionLinesController } from './production-lines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionLine } from './entities/production-line.entity';
import { FinalGoodsModule } from '../final-goods/final-goods.module';
import { OrganisationsModule } from '../organisations/organisations.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionLine]), FinalGoodsModule, OrganisationsModule],
  controllers: [ProductionLinesController],
  providers: [ProductionLinesService],
  exports: [ProductionLinesService]
})
export class ProductionLinesModule {}

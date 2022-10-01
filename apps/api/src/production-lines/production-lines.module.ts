import { forwardRef, Module } from '@nestjs/common';
import { ProductionLinesService } from './production-lines.service';
import { ProductionLinesController } from './production-lines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionLine } from './entities/production-line.entity';
import { OrganisationsModule } from '../organisations/organisations.module';
import { BillOfMaterialsModule } from '../bill-of-materials/bill-of-materials.module';
import { FactoryMachinesModule } from '../factory-machines/factory-machines.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionLine]), BillOfMaterialsModule, OrganisationsModule, forwardRef(() => FactoryMachinesModule)],
  controllers: [ProductionLinesController],
  providers: [ProductionLinesService],
  exports: [ProductionLinesService]
})
export class ProductionLinesModule {}

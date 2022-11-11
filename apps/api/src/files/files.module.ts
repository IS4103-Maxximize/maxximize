import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { OrganisationsModule } from '../organisations/organisations.module';
import { ApplicationsModule } from '../applications/applications.module';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { FinalGoodsModule } from '../final-goods/final-goods.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), OrganisationsModule, ApplicationsModule, PurchaseOrdersModule, FinalGoodsModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule {}

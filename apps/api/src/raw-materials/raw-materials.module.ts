import { Module } from '@nestjs/common';
import { RawMaterialsService } from './raw-materials.service';
import { RawMaterialsController } from './raw-materials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawMaterial } from './entities/raw-material.entity';
import { Product } from '../products/entities/product.entity';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { Organisation } from '../organisations/entities/organisation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RawMaterial, Product, ShellOrganisation, Organisation])],
  controllers: [RawMaterialsController],
  providers: [RawMaterialsService],
  exports: [RawMaterialsService]
})
export class RawMaterialsModule {}

import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';
import { BinsModule } from '../bins/bins.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, RawMaterial]), BinsModule],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}

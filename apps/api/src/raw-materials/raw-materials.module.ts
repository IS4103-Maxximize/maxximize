import { Module } from '@nestjs/common';
import { RawMaterialsService } from './raw-materials.service';
import { RawMaterialsController } from './raw-materials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawMaterial } from './entities/raw-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RawMaterial])],
  controllers: [RawMaterialsController],
  providers: [RawMaterialsService]
})
export class RawMaterialsModule {}

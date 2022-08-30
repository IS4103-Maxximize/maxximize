import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { FinalGood } from '../final-goods/entities/final-good.entity';
import { RawMaterial } from '../raw-materials/entities/raw-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, FinalGood, RawMaterial])],
  controllers: [RecipesController],
  providers: [RecipesService]
})
export class RecipesModule {}

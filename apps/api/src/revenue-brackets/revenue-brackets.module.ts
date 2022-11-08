import { Module } from '@nestjs/common';
import { RevenueBracketsService } from './revenue-brackets.service';
import { RevenueBracketsController } from './revenue-brackets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevenueBracket } from './entities/revenue-bracket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RevenueBracket])],
  controllers: [RevenueBracketsController],
  providers: [RevenueBracketsService],
  exports: [RevenueBracketsService]
})
export class RevenueBracketsModule {}

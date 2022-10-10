import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QualityReviewsService } from './quality-reviews.service';
import { CreateQualityReviewDto } from './dto/create-quality-review.dto';
import { UpdateQualityReviewDto } from './dto/update-quality-review.dto';

@Controller('quality-reviews')
export class QualityReviewsController {
  constructor(private readonly qualityReviewsService: QualityReviewsService) {}

  @Post()
  create(@Body() createQualityReviewDto: CreateQualityReviewDto) {
    return this.qualityReviewsService.create(createQualityReviewDto);
  }

  @Get()
  findAll() {
    return this.qualityReviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qualityReviewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQualityReviewDto: UpdateQualityReviewDto) {
    return this.qualityReviewsService.update(+id, updateQualityReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qualityReviewsService.remove(+id);
  }
}

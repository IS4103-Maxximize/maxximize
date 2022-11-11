import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateFinalGoodDto } from './dto/create-final-good.dto';
import { UpdateFinalGoodDto } from './dto/update-final-good.dto';
import { FinalGoodsService } from './final-goods.service';

@Controller('final-goods')
export class FinalGoodsController {
  constructor(private readonly finalGoodsService: FinalGoodsService) {}

  @Post()
  create(@Body() createFinalGoodDto: CreateFinalGoodDto) {
    return this.finalGoodsService.create(createFinalGoodDto);
  }

  @Get()
  findAll() {
    return this.finalGoodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finalGoodsService.findOne(+id);
  }

  @Get('orgId/:id')
  findAllByOrg(@Param('id') id: string) {
    return this.finalGoodsService.findAllByOrg(+id);
  }

  @Get('/shortfall/:id/:finalGoodsId/:numOfMonths/:quantity')
  getShortfall(
    @Param('id') id: number,
    @Param('finalGoodsId') finalGoodsId: number,
    @Param('numOfMonths') numOfMonths: number,
    @Param('quantity') quantity
  ) {
    return this.finalGoodsService.getShortFall(finalGoodsId, quantity, id, numOfMonths);
  }

  @Get('/demand-forecast/:id/:finalGoodsId/:numOfMonths')
  getDemandForecast(
    @Param('id') id: number,
    @Param('finalGoodsId') finalGoodsId: number,
    @Param('numOfMonths') numOfMonths: number
  ) {
    return this.finalGoodsService.getDemandForecast(
      id,
      finalGoodsId,
      numOfMonths
    );
  }

  @Get('topSales/:id')
  findTopSellingGoods(@Param('id') id: string) {
    return this.finalGoodsService.findTopSellingGoods(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFinalGoodDto: UpdateFinalGoodDto
  ) {
    return this.finalGoodsService.update(+id, updateFinalGoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finalGoodsService.remove(+id);
  }
}

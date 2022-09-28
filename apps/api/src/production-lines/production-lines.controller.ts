import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductionLinesService } from './production-lines.service';
import { CreateProductionLineDto } from './dto/create-production-line.dto';
import { UpdateProductionLineDto } from './dto/update-production-line.dto';
import { RetrieveSchedulesDto } from './dto/retrieve-schedules.dto';

@Controller('production-lines')
export class ProductionLinesController {
  constructor(private readonly productionLinesService: ProductionLinesService) {}

  @Post()
  create(@Body() createProductionLineDto: CreateProductionLineDto) {
    return this.productionLinesService.create(createProductionLineDto);
  }

  @Get()
  findAll() {
    return this.productionLinesService.findAll();
  }

  @Get('/earliestSchedules')
  @UsePipes(new ValidationPipe( {transform: true}))
  getSchedulesForQty(@Query() dto: RetrieveSchedulesDto) {
    return this.productionLinesService.retrieveSchedulesForProductionOrder(dto.quantity, dto.finalGoodId, dto.daily, dto.days)
  }


  @Get('orgId/:id')
  findAllByOrg(@Param('id') id: string) {
    return this.productionLinesService.findAllByOrg(+id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productionLinesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductionLineDto: UpdateProductionLineDto) {
    return this.productionLinesService.update(+id, updateProductionLineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productionLinesService.remove(+id);
  }
}

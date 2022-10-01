import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductionOrdersService } from './production-orders.service';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { UpdateProductionOrderDto } from './dto/update-production-order.dto';

@Controller('production-orders')
export class ProductionOrdersController {
  constructor(
    private readonly productionOrdersService: ProductionOrdersService
  ) {}

  @Post()
  create(@Body() createProductionOrderDto: CreateProductionOrderDto) {
    return this.productionOrdersService.create(createProductionOrderDto);
  }

  @Get()
  findAll() {
    return this.productionOrdersService.findAll();
  }

  @Get('cron')
  retrieveCronJobs() {
    return this.productionOrdersService.retrieveCronJobs();
  }

  @Get('all/:id')
  findAllByOrgId(@Param('id') id: string) {
    return this.productionOrdersService.findAllByOrgId(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productionOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductionOrderDto: UpdateProductionOrderDto
  ) {
    return this.productionOrdersService.update(+id, updateProductionOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productionOrdersService.remove(+id);
  }
}

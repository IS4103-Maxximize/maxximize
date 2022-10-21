import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductionRequestsService } from './production-requests.service';
import { CreateProductionRequestDto } from './dto/create-production-request.dto';
import { UpdateProductionRequestDto } from './dto/update-production-request.dto';

@Controller('production-requests')
export class ProductionRequestsController {
  constructor(
    private readonly productionRequestsService: ProductionRequestsService
  ) {}

  @Post()
  create(@Body() createProductionRequestDto: CreateProductionRequestDto) {
    return this.productionRequestsService.create(createProductionRequestDto);
  }

  @Post('bulk')
  bulkCreate(@Body() createProductionRequestDtos: CreateProductionRequestDto[]) {
    return this.productionRequestsService.bulkCreate(createProductionRequestDtos)
  }

  @Get()
  findAll() {
    return this.productionRequestsService.findAll();
  }

  @Get('all/:id')
  findAllByOrgId(@Param('id') id: string) {
    return this.productionRequestsService.findAllByOrgId(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productionRequestsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductionRequestDto: UpdateProductionRequestDto
  ) {
    return this.productionRequestsService.update(
      +id,
      updateProductionRequestDto
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productionRequestsService.remove(+id);
  }
}

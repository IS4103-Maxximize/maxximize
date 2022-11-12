import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';

@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  create(@Body() createBatchDto: CreateBatchDto) {
    return this.batchesService.create(createBatchDto);
  }

  @Get()
  findAll() {
    return this.batchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batchesService.findOne(+id);
  }

  @Get('findAllByOrg/:id')
  findAllByOrganisation(@Param('id') id: string) {
    return this.batchesService.findAllByOrganisationId(+id);
  }

  @Get('batchTracking/:batchNumber')
  findOneDeep(@Param('batchNumber') batchNumber: string) {
    return this.batchesService.batckTrackBatch(batchNumber)
  }

  @Get('customersAffected/:batchNumber')
  findAffectedCustomers(@Param('batchNumber') batchNumber: string) {
    return this.batchesService.getEndCustomersFromBatchNumber(batchNumber)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBatchDto: UpdateBatchDto) {
    return this.batchesService.update(+id, updateBatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchesService.remove(+id);
  }
}

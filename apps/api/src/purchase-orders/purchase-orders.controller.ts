import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { ReserveDto } from './dto/reserve-dto';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.purchaseOrdersService.create(createPurchaseOrderDto);
  }

  @Post('/reserve')
  reserve(@Body() reserveDto: ReserveDto) {
    return this.purchaseOrdersService.reserve(reserveDto);
  }

  @Get()
  findAll() {
    return this.purchaseOrdersService.findAll();
  }

  @Get('sent/:id')
  findSentPurchaseOrdersByOrg(@Param('id') id: string) {
    return this.purchaseOrdersService.findSentPurchaseOrderByOrg(+id)
  }

  @Get('received/:id')
  findReceivedPurchaseOrdersByOrg(@Param('id') id: string) {
    return this.purchaseOrdersService.findReceivedPurchaseOrderByOrg(+id)
  }

  @Get('all/:id')
  findAllByOrgId(@Param('id') id: string) {
    return this.purchaseOrdersService.findAllByOrgId(+id);
  }

  @Get('getUnfufilledLineItems/:id')
  getUnfufilledLineItems(@Param('id') id: string) {
    return this.purchaseOrdersService.getUnfufilledLineItems(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto
  ) {
    return this.purchaseOrdersService.update(+id, updatePurchaseOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrdersService.remove(+id);
  }
}

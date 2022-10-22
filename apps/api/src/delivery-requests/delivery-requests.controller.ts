import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliveryRequestsService } from './delivery-requests.service';
import { CreateDeliveryRequestDto } from './dto/create-delivery-request.dto';
import { UpdateDeliveryRequestDto } from './dto/update-delivery-request.dto';

@Controller('delivery-requests')
export class DeliveryRequestsController {
  constructor(private readonly deliveryRequestsService: DeliveryRequestsService) {}

  @Post()
  create(@Body() createDeliveryRequestDto: CreateDeliveryRequestDto) {
    return this.deliveryRequestsService.create(createDeliveryRequestDto);
  }

  // @Post('partialFufillment')
  // createPartialFufillment(@Body() createDeliveryRequestDto: CreateDeliveryRequestDto) {
  //   return this.deliveryRequestsService.createDeliveryRequestProdReq(createDeliveryRequestDto);
  // }

  @Get()
  findAll() {
    return this.deliveryRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryRequestsService.findOne(+id);
  }

  @Get('findAllByWorkerId/:id')
  findAllByWorkerId(@Param('id') id: string) {
    return this.deliveryRequestsService.findAllByWorkerId(+id);
  }

  @Get('findAllByOrganisationId/:id')
  findAllByOrganisationId(@Param('id') id: string) {
    return this.deliveryRequestsService.findAllByOrganisationId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeliveryRequestDto: UpdateDeliveryRequestDto) {
    return this.deliveryRequestsService.update(+id, updateDeliveryRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryRequestsService.remove(+id);
  }
}

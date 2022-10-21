import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReservationLineItemsService } from './reservation-line-items.service';
import { CreateReservationLineItemDto } from './dto/create-reservation-line-item.dto';
import { UpdateReservationLineItemDto } from './dto/update-reservation-line-item.dto';

@Controller('reservation-line-items')
export class ReservationLineItemsController {
  constructor(private readonly reservationLineItemsService: ReservationLineItemsService) {}

  @Post()
  create(@Body() createReservationLineItemDto: CreateReservationLineItemDto) {
    return this.reservationLineItemsService.create(createReservationLineItemDto);
  }

  @Get()
  findAll() {
    return this.reservationLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationLineItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationLineItemDto: UpdateReservationLineItemDto) {
    return this.reservationLineItemsService.update(+id, updateReservationLineItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationLineItemsService.remove(+id);
  }
}

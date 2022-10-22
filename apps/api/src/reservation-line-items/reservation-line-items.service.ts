import { Injectable } from '@nestjs/common';
import { CreateReservationLineItemDto } from './dto/create-reservation-line-item.dto';
import { UpdateReservationLineItemDto } from './dto/update-reservation-line-item.dto';

@Injectable()
export class ReservationLineItemsService {
  create(createReservationLineItemDto: CreateReservationLineItemDto) {
    return 'This action adds a new reservationLineItem';
  }

  findAll() {
    return `This action returns all reservationLineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservationLineItem`;
  }

  update(id: number, updateReservationLineItemDto: UpdateReservationLineItemDto) {
    return `This action updates a #${id} reservationLineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservationLineItem`;
  }
}

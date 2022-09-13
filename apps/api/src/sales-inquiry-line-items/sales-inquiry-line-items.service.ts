import { Injectable } from '@nestjs/common';
import { CreateSalesInquiryLineItemDto } from './dto/create-sales-inquiry-line-item.dto';
import { UpdateSalesInquiryLineItemDto } from './dto/update-sales-inquiry-line-item.dto';

@Injectable()
export class SalesInquiryLineItemsService {
  create(createSalesInquiryLineItemDto: CreateSalesInquiryLineItemDto) {
    return 'This action adds a new salesInquiryLineItem';
  }

  findAll() {
    return `This action returns all salesInquiryLineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salesInquiryLineItem`;
  }

  update(
    id: number,
    updateSalesInquiryLineItemDto: UpdateSalesInquiryLineItemDto
  ) {
    return `This action updates a #${id} salesInquiryLineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} salesInquiryLineItem`;
  }
}

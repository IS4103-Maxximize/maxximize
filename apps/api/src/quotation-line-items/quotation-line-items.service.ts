import { Injectable } from '@nestjs/common';
import { CreateQuotationLineItemDto } from './dto/create-quotation-line-item.dto';
import { UpdateQuotationLineItemDto } from './dto/update-quotation-line-item.dto';

@Injectable()
export class QuotationLineItemsService {
  create(createQuotationLineItemDto: CreateQuotationLineItemDto) {
    return 'This action adds a new quotationLineItem';
  }

  findAll() {
    return `This action returns all quotationLineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quotationLineItem`;
  }

  update(id: number, updateQuotationLineItemDto: UpdateQuotationLineItemDto) {
    return `This action updates a #${id} quotationLineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} quotationLineItem`;
  }
}

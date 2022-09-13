import { Injectable } from '@nestjs/common';
import { CreateSalesInquiryDto } from './dto/create-sales-inquiry.dto';
import { UpdateSalesInquiryDto } from './dto/update-sales-inquiry.dto';

@Injectable()
export class SalesInquiryService {
  create(createSalesInquiryDto: CreateSalesInquiryDto) {
    return 'This action adds a new salesInquiry';
  }

  findAll() {
    return `This action returns all salesInquiry`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salesInquiry`;
  }

  update(id: number, updateSalesInquiryDto: UpdateSalesInquiryDto) {
    return `This action updates a #${id} salesInquiry`;
  }

  remove(id: number) {
    return `This action removes a #${id} salesInquiry`;
  }
}

import { Module } from '@nestjs/common';
import { SalesInquiryService } from './sales-inquiry.service';
import { SalesInquiryController } from './sales-inquiry.controller';
import { SalesInquiry } from './entities/sales-inquiry.entity';
import { SalesInquiryLineItem } from '../sales-inquiry-line-items/entities/sales-inquiry-line-item.entity';
import { ShellOrganisation } from '../shell-organisations/entities/shell-organisation.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { Organisation } from '../organisations/entities/organisation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([SalesInquiry, SalesInquiryLineItem, ShellOrganisation, Quotation, Organisation]), MailModule],
  controllers: [SalesInquiryController],
  providers: [SalesInquiryService],
})
export class SalesInquiryModule {}

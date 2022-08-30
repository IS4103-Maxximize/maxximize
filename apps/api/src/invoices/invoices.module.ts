import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { Invoice } from './entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Order])],
  controllers: [InvoicesController],
  providers: [InvoicesService]
})
export class InvoicesModule {}

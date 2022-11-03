import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { CreateStripeCustomerDto } from './dto/create-stripe-customer.dto';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipsService.create(createMembershipDto);
  }

  @Post('webhook')
  eventListener(@Req() request: Request) {
    return this.membershipsService.handleEvents(request.body)
  }

  @Get()
  findAll() {
    return this.membershipsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembershipDto: UpdateMembershipDto) {
    return this.membershipsService.update(+id, updateMembershipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipsService.remove(+id);
  }

  //products

  @Get('stripe/products')
  findProducts() {
    return this.membershipsService.getAllProducts()
  }

  //customer

  @Get('stripe/customers')
  findAllCustomers() {
    return this.membershipsService.getAllCustomers()
  }

  @Get('stripe/customers/:id')
  findCustomer(@Param('id') id: string) {
    return this.membershipsService.getCustomer(id)
  }

  @Post('createCustomer')
  createCustomerForStripe(@Body() createStripeCustomerDto: CreateStripeCustomerDto) {
    return this.membershipsService.createStripeCustomer(createStripeCustomerDto)
  }


  //invoices
  @Get('stripe/invoices/customers/:id')
  findInvoicesOfCustomer(@Param('id') id: string) {
    return this.membershipsService.getInvoicesOfCustomer(id)
  }

  @Get('stripe/invoices/subscriptions/:id')
  findInvoicesOfSubscription(@Param('id') id: string) {
    return this.membershipsService.getInvoicesOfSubsciption(id)
  }

}

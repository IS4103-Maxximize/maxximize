import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipsService } from './memberships.service';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipsService.create(createMembershipDto);
  }

  @Get()
  findAll() {
    return this.membershipsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipsService.findOne(+id);
  }

  @Get('orgId/:id')
  findOneByOrg(@Param('id') id: string) {
    return this.membershipsService.findOneByOrg(+id)
  }

  @Get('customer/:id')
  findMembershipByCustomer(@Param('id') id: string) {
    return this.membershipsService.findMembershipByCustomer(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembershipDto: UpdateMembershipDto) {
    return this.membershipsService.update(+id, updateMembershipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipsService.remove(+id);
  }

  //webhooks

  @Post('webhook')
  eventListener(@Req() request: Request) {
    return this.membershipsService.handleEvents(request.body)
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

  // NOT IN USE
  //customer, membership mapping to org

  // @Post('createMembershipAndSetCustomer')
  // createCustomerForStripe(@Body() createMembershipDto: CreateMembershipDto) {
  //   return this.membershipsService.createMembershipAndSetCustomer(createMembershipDto)
  // }


  //invoices
  @Get('stripe/invoices/customers/:id')
  findInvoicesOfCustomer(@Param('id') id: string) {
    return this.membershipsService.getInvoicesOfCustomer(id)
  }

  @Get('stripe/invoices/subscriptions/:id')
  findInvoicesOfSubscription(@Param('id') id: string) {
    return this.membershipsService.getInvoicesOfSubsciption(id)
  }

  //payment methods
  @Get('stripe/paymentMethods/customers/:id')
  findPaymentMethodsOfCustomer(@Param('id') id: string) {
    return this.membershipsService.getCustomerPaymentMethods(id)
  }
}

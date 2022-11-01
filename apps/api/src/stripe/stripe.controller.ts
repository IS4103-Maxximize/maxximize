import { Body, Controller, Post } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateCustomerPortalSessionDto } from './dtos/create-customer-portal-session.dto';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-customer-portal-session')
  async createCustomerPortalSession(@Body() createCustomerPortalSessionDto: CreateCustomerPortalSessionDto): 
  Promise<Stripe.Response<Stripe.BillingPortal.Session>> {
    return this.stripeService.createCustomerPortalSession(createCustomerPortalSessionDto);
  }
}

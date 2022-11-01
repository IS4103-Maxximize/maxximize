import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateCustomerPortalSessionDto } from './dtos/create-customer-portal-session.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-08-01',
    });
  }

  // return session url
  async createCustomerPortalSession(createCustomerPortalSessionDto: CreateCustomerPortalSessionDto): Promise<string> {
    const {
      customerId,
      returnUrl,
      ...rest
    } = createCustomerPortalSessionDto;

    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  }
}

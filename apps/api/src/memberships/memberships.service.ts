import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { OrganisationsService } from '../organisations/organisations.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './entities/membership.entity';
import { MembershipStatus } from './enums/membership-status.enum';
import { SubscriptionPlan } from './enums/subscription-plan.enum';

@Injectable()
export class MembershipsService {
  private stripe: Stripe
  constructor(
    @InjectRepository(Membership)
    private readonly membershipsRepository: Repository<Membership>,
    @Inject(forwardRef(() => OrganisationsService))
    private organisationService: OrganisationsService
  ) {
    this.stripe = new Stripe(process.env.API_SECRET_KEY, {
      apiVersion: '2022-08-01'
    })
  }
  // Called upon webhook 'customer.subscription.created' trigger
  async create(createMembershipDto: CreateMembershipDto) {
    const {organisationId, customerId} = createMembershipDto
    const organisationToBeAdded = await this.organisationService.findOne(organisationId)
    const newMembership = this.membershipsRepository.create({
      organisation: organisationToBeAdded,
      customerId: customerId
    })
    return this.membershipsRepository.save(newMembership)
  }

  async findAll() {
    return this.membershipsRepository.find()
  }

  async findOne(id: number) {
    try {
      return await this.membershipsRepository.findOneOrFail({
        where: {
          id
        }
      })
    } catch(error) {
      throw new NotFoundException(`membership of id: ${id} cannot be found!`)
    }
  }

  async findOneByOrg(id: number) {
    try {
      return await this.membershipsRepository.findOneOrFail({
        where: {
          organisationId: id
        }
      })
    } catch(error) {
      throw new NotFoundException(`membership of id: ${id} cannot be found!`)
    }
  }

  async update(id: number, updateMembershipDto: UpdateMembershipDto) {
    const membershipToUpdate = await this.findOne(id)
    const mapping = Object.entries(updateMembershipDto)
    if (mapping.length > 0) {
      for (const [key, value] of mapping) {
        membershipToUpdate[key] = value
      }
    }
    return this.membershipsRepository.save(membershipToUpdate)
  }

  async remove(id: number) {
    const membershipToRemove = await this.findOne(id)
    return this.membershipsRepository.remove(membershipToRemove)
  }

  async findMembershipByCustomer(customerId: string) {
    try {
      return await this.membershipsRepository.findOneOrFail({
        where: {
          customerId
        }
      })
    } catch (error) {
      throw new NotFoundException(`customer with id: ${customerId} cannot be found!`)
    }
  }

  //----------------------------------Stripe Customer services---------------------------------------------------------------------

  //--------------NOT IN USE--------------------------------------------------------
  //create customer mapping with organisation
  // async createMembershipAndSetCustomer(createMembershipDto: CreateMembershipDto) {
  //   let membership: Membership
  //   const organisation = await this.organisationService.findOne(createMembershipDto.organisationId)
  //   if (!organisation.membership) {
  //     const createMembershipDto: CreateMembershipDto = {
  //       organisationId: organisation.id
  //     }
  //     membership = await this.create(createMembershipDto)
  //   } else {
  //     throw new BadRequestException('this organisation already has a membership')
  //   }
  //   const createStripeCustomerDto: CreateStripeCustomerDto = {
  //     email: organisation.contact.email,
  //     name: organisation.name,
  //     phone: organisation.contact.phoneNumber,
  //     address: organisation.contact.address,
  //     membershipId: membership.id
  //   }
  //   return await this.createStripeCustomer(createStripeCustomerDto)
  // }
  // async createStripeCustomer(createStripeCustomerDto: CreateStripeCustomerDto) {
  //   const {email, name, phone, address, membershipId} = createStripeCustomerDto
  //   let membership = await this.findOne(membershipId)
  //   let newCustomer: any
  //   if (membership) {
  //     newCustomer = await this.stripe.customers.create({
  //       email,
  //       name,
  //       phone,
  //       address: {
  //         line1: address
  //       }
  //     })
  //   }
  //   //save customer into membership
  //   membership = await this.update(membershipId, {customerId: newCustomer.id})
  //   return membership
  // }
  //--------------END OF NOT IN USE--------------------------------------------------------

  //get all customers
  async getAllCustomers() {
    const customersObject = await this.stripe.customers.list({
      limit: 100
    })
    const allCustomers = customersObject.data
    const parsedCustomers = allCustomers.map(customer => {
      return {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        created: new Date(customer.created * 1000),
        defaultSource: customer.default_source
      }
    })
    return parsedCustomers
  }

  //get a customer
  async getCustomer(customerId: string) {
    const retrievedCustomer = await this.stripe.customers.retrieve(customerId) as Stripe.Customer
    const parsedCustomer = {
      id: retrievedCustomer.id,
      email: retrievedCustomer.email,
      name: retrievedCustomer.name,
      created: new Date(retrievedCustomer.created * 1000),
      description: retrievedCustomer.description,
      defaultSource: retrievedCustomer.default_source
    }
    return parsedCustomer
  }

  //------------------------------------------------------------------------------------------------------------------------


  //----------------------------------Stripe Product services----------------------------------------------------------------------
  //get all the products from stripe

  async getAllProducts() {
    const products = (await this.stripe.products.list({
      // **Stripe trigger testing creates dummy products, BEWARE**
      // set limit of 100 to prevent 404 error
      limit: 100, 
      active: true,
    })).data
    const parsedProducts = products.map(product => {
      return {
        id: product.id,
        name: product.name
      }
    })
    return parsedProducts
    
  }

  async getProduct(productId: string) {
    const allProducts = await this.getAllProducts()
    const product = allProducts.filter(product => product.id === productId)
    if (product.length === 1) {
      return product[0]
    } else {
      throw new NotFoundException(`product with id: ${productId} cannot be found!`)
    }
  }

  async getSubscriptionPlan(product) {
    if (product.name === 'Pro') {
      return SubscriptionPlan.PRO
    } else {
      return SubscriptionPlan.BASIC
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------



  //----------------------------------Webhook Services----------------------------------------------------------------------
  //get mapping of productCode to product Name

 //handle Events
 async handleEvents(body: any) {
  let subscription: any
  const {type} = body
  if (type === "customer.subscription.created") {
      const subscription = body.data.object
      console.log(subscription);
      //get the id of subscription and customer Id
      const {
        id: subscriptionId, 
        customer: customerId, 
        cancel_at, 
        current_period_start, 
        current_period_end, 
        days_until_due, 
        plan
      } = subscription
      
      const customer = await this.getCustomer(customerId)
      const organisation = await this.organisationService.findOrgByEmail(customer.email);

      if (!organisation.membership) {
        await this.create({
          customerId: customerId,
          organisationId: organisation.id
        })
      }
      
      let membership = await this.findMembershipByCustomer(customerId)
      console.log(membership)

      const { product, amount } = plan
      const stripeProduct = await this.getProduct(product)
      const currentSubscriptionPlan = await this.getSubscriptionPlan(stripeProduct)

      //save the subscriptionId
      membership = await this.update(membership.id, {subscriptionId: subscriptionId,
        cancelAt: null,
        currentPeriodStart: new Date(current_period_start * 1000),
        currentPeriodEnd: new Date(current_period_end * 1000),
        planAmount: amount / 100,
        plan: currentSubscriptionPlan,
        status: MembershipStatus.ACTIVE,
        defaultPayment: customer.defaultSource as string
      })
      console.log(membership)
      return membership
  } else if (type === 'customer.subscription.updated') {
      subscription = body.data.object
      const {
        customer: customerId, 
        cancel_at,  
        plan,
        pause_collection,
        current_period_start, 
        current_period_end, 
      } = subscription
      console.log(subscription)
      const customer = await this.getCustomer(customerId)
      const {amount, product} = plan
      const stripeProduct = await this.getProduct(product)
      const currentSubscriptionPlan = await this.getSubscriptionPlan(stripeProduct)
      let membership = await this.findMembershipByCustomer(customerId)
      const newStatus = pause_collection ? MembershipStatus.PAUSED : MembershipStatus.ACTIVE
      

      //update the membership with important fields

      membership = await this.update(membership.id, {
        plan: currentSubscriptionPlan ?? null,
        planAmount: amount ? amount / 100 : null,
        status: newStatus,
        currentPeriodStart: new Date(current_period_start * 1000),
        currentPeriodEnd: new Date(current_period_end * 1000),
        cancelAt: cancel_at ? new Date(cancel_at * 1000) : null,
        defaultPayment: customer.defaultSource as string
      })
      
      return membership
  } else if (type === 'customer.subscription.deleted') {
    //when a subsciption is deleted, 
    //set isActive to false
    //set all fields to null
    subscription = body.data.object
    console.log(subscription)
      const {
        customer: customerId,
        id: subscriptionId
      } = subscription
      let membership = await this.findMembershipByCustomer(customerId)
      if (membership.subscriptionId === subscriptionId) {
        membership = await this.update(membership.id, {
          subscriptionId: null,
          plan: null,
          cancelAt: null,
          currentPeriodStart: null,
          currentPeriodEnd: null,
          daysUntilDue: null,
          planAmount: null,
          defaultPayment: null,
          status: MembershipStatus.INACTIVE
        })
      }
      return membership
  }
  else if (type === 'customer.created') {
    // const customer = body.data.object
    console.log(body.data.object)
  }
 }
 //------------------------------------------------------------------------------------------------------------------

 //----------------------------------Stripe invoices services----------------------------------------------------------------------

 async getInvoicesOfCustomer(customerId: string) {
  const allInvoicesObject = await this.stripe.invoices.list({
    customer: customerId
  })
  const allInvoices = allInvoicesObject.data
  const parsedInvoices = allInvoices.map(invoice => {
    const {id, total, subscription, description, created, status, billing_reason } = invoice
    return {
      id,
      total: total / 100,
      description,
      created: new Date(created * 1000),
      status,
      billingReason: billing_reason as string === 'subscription_create' ? 'Subscription' : 'Others',
      subscriptionId: subscription
    }
  })
  return parsedInvoices
 }

 async getInvoicesOfSubscription(subscriptionId: string) {
  const allInvoicesObject = await this.stripe.invoices.list({
    subscription: subscriptionId
  })
  const allInvoices = allInvoicesObject.data
  const parsedInvoices = allInvoices.map(invoice => {
    const {id, total, description, created, status } = invoice
    return {
      id,
      total: total/ 100,
      description,
      created: new Date(created * 1000),
      status
    }
  })
  return parsedInvoices
 }



 //---------------------------------------------------------------------------------------------------------------------------



 //----------------------------------Stripe subscription services----------------------------------------------------------------------

 async pauseSubscription(subscriptionId: string) {
  const subscription = await this.stripe.subscriptions.update(subscriptionId, {
    pause_collection: {behavior: 'void'}
  })
  return subscription
 }

 async resumeSubscription(subscriptionId: string) {
  const subscription = await this.stripe.subscriptions.update(subscriptionId, {
    pause_collection: ''
  })
  return subscription
 }

 //---------------------------------------------------------------------------------------------------------------------------

 //-------------------------------------Stripe payment methods----------------------------------------------------------------

  //get customer payment methods

 async getCustomerPaymentMethods(customerId: string) {
  const paymentMethods = await this.stripe.customers.listPaymentMethods(
    customerId, {type: 'card'} //set as static type first, might change to dynamic if needed
  )
  const listOfPaymentMethods = paymentMethods.data
  return listOfPaymentMethods.map(paymentMethod => {
    return {
      id: paymentMethod.id,
      billingDetails: paymentMethod.billing_details,
      card: paymentMethod.card,
      type: paymentMethod.type,
      created: paymentMethod.created
    }
  })
 }

 //---------------------------------------------------------------------------------------------------------------------------

 //-------------------------------------Stripe Subscriptions------------------------------------------------------------------

 async getCustomerSubscriptions(customerId: string) {
  const subscriptionsObject = await this.stripe.subscriptions.list({
    limit: 100,
    status: 'all',
    customer: customerId
  })
  const subscriptions = subscriptionsObject.data
  const parsedSubscriptionsPromises = subscriptions.map(async subscription => {
    const plan = subscription['plan']
    const {product} = plan
    const stripeProduct = await this.getProduct(product)

    const {id, created, currency, current_period_start, current_period_end, ended_at, status, cancel_at} = subscription

    return {
      id,
      created: new Date(created * 1000),
      currency,
      currentPeriodStart: current_period_start ? new Date(current_period_start * 1000): null,
      currentPeriodEnd: current_period_end ? new Date(current_period_end * 1000) : null,
      endedAt: ended_at ? new Date(ended_at * 1000): null,
      status,
      cancelAt: cancel_at ? new Date(cancel_at * 1000): null,
      plan: stripeProduct.name
    }
  })
  const parsedSubscriptions = await Promise.all(parsedSubscriptionsPromises)
  const sortedSubscriptions = parsedSubscriptions.sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') {
      return -1
    } else if (a.status !== 'active' && b.status === 'active') {
      return 1
    } else {
      if (a.created.getTime() > b.created.getTime()) {
        return -1
      } else {
        return 1
      }
    }
  })
  return sortedSubscriptions
 }
}

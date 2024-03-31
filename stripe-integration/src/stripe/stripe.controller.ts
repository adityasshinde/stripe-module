import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { StripeService1 } from './stripe.service';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService1) {}

  @Get('config')
  async getStripeConfig() {
    return this.stripeService.getstripeConfig();
  }

  @Patch('update-config')
  async updateStripeConfig(
    @Body('config') config: Stripe.StripeConfig,
  ) {
    return this.stripeService.updateStripeConfig(config);
  }

  @Get('customers/:limit/:startingAfter')
  async getAllCustomers(
    @Param('limit') limit: number,
    @Param('startingAfter') startingAfter: number,
  ) {
    try {
      const customers = await this.stripeService.getAllCustomers(limit, startingAfter);
      return { customers };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('create-customer')
  async createCustomer(
    @Body('email') email: string,
    @Body('name') name?: string,
  ) {
    try {
      const customer = await this.stripeService.createCustomer(email, name);
      return { customer };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('customer/:id')
  async getCustomerById(@Param('id') id: string) {
    try {
      const customers = await this.stripeService.getCustomerById(id);
      return { customers };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Patch('customer/:id')
  async updateCustomer(
    @Param('id') customerId: string,
    @Body() updateParams: Stripe.CustomerUpdateParams,
  ) {
    try {
      const updatedCustomer = await this.stripeService.updateCustomer(
        customerId,
        updateParams,
      );
      return { customer: updatedCustomer };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete('customer/:id')
  async deleteCustomer(@Param('id') customerId: string) {
    try {
      const message = await this.stripeService.deleteCustomer(customerId);
      return { message };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('create-card-payment-method')
  async createCardPaymentMethod(
    @Body('customerId') customerId: string,
    @Body('cardNumber') cardNumber: string,
    @Body('expMonth') expMonth: number,
    @Body('expYear') expYear: number,
    @Body('cvc') cvc: string,
  ) {
    try {
      const paymentMethod = await this.stripeService.createCardPaymentMethod(
        customerId,
        cardNumber,
        expMonth,
        expYear,
        cvc,
      );
      return { paymentMethod };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('payment-method/:id')
  async getPaymentMethod(@Param('id') paymentMethodId: string) {
    try {
      const paymentMethod = await this.stripeService.getPaymentMethod(
        paymentMethodId,
      );
      return { paymentMethod };
    } catch (error) {
      return { error: error.message };
    }
  }


  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body('amount') amount: number,
    @Body('currency') currency: string,
    @Body('paymentMethod') paymentMethod?: string,
    @Body('customerId') customerId?: string,
    @Body('returnUrl') returnUrl?: string,
  ) {
    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(
        amount,
        currency,
        paymentMethod,
      );
      return { paymentIntent };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('confirm-payment-intent/:id')
  async confirmPaymentIntent(@Param('id') paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripeService.confirmPaymentIntent(
        paymentIntentId
      );
      return { paymentIntent };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('capture-payment-intent/:id')
  async capturePaymentIntent(@Param('id') paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripeService.capturePaymentIntent(
        paymentIntentId
      );
      return { paymentIntent };
    } catch (error) {
      return { error: error.message };
    }
  }


  @Get('retrieve-payment-intent/:paymentIntentId')
  async retrievePaymentIntent(@Param('paymentIntentId') paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripeService.retrievePaymentIntent(paymentIntentId);
      return { paymentIntent };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('create-subscription')
  async createSubscription(
    @Body('customerId') customerId: string,
    @Body('planId') priceId: string,
  ) {
    try {
      const subscription = await this.stripeService.createSubscription(
        customerId,
        priceId,
      );
      return { subscription };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('subscription/:id')
  async getSubscription(@Param('id') subscriptionId: string) {
    try {
      const subscription = await this.stripeService.getSubscription(
        subscriptionId,
      );
      return { subscription };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete('subscription/:id')
  async cancelSubscription(@Param('id') subscriptionId: string) {
    try {
      const canceledSubscription = await this.stripeService.cancelSubscription(
        subscriptionId,
      );
      return { canceledSubscription };
    } catch (error) {
      return { error: error.message };
    }
  }
}

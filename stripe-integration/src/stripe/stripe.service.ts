import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripe: Stripe) {}

  async getstripeConfig(): Promise<{ publishableKey: string }> {
    return {
      publishableKey: process.env.STRIPE_PUBLIC_KEY,
    };
  }

  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
      });
      return customer;
    } catch (error) {
      throw new Error('Error creating customer: ' + error.message);
    }
  }

  async getCustomerByEmail(email: string): Promise<Stripe.Customer[]> {
    try {
      const customers = await this.stripe.customers.list({ email });
      return customers.data;
    } catch (error) {
      throw new Error('Error retrieving customer: ' + error.message);
    }
  }

  async updateCustomer(
    customerId: string,
    updateParams: Stripe.CustomerUpdateParams,
  ): Promise<Stripe.Customer> {
    try {
      const updatedCustomer = await this.stripe.customers.update(
        customerId,
        updateParams,
      );
      return updatedCustomer;
    } catch (error) {
      throw new Error('Error updating customer: ' + error.message);
    }
  }

  async deleteCustomer(customerId: string): Promise<{ message: string }> {
    try {
      await this.stripe.customers.del(customerId);
      return { message: 'Customer deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting customer: ' + error.message);
    }
  }

  async createCardPaymentMethod(
    customerId: string,
    cardNumber: string,
    expMonth: number,
    expYear: number,
    cvc: string,
  ): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: cardNumber,
          exp_month: expMonth,
          exp_year: expYear,
          cvc: cvc,
        },
      });
      return paymentMethod;
    } catch (error) {
      throw new Error('Error creating card payment method: ' + error.message);
    }
  }

  async getPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.retrieve(
        paymentMethodId,
      );
      return paymentMethod;
    } catch (error) {
      throw new Error('Error retrieving payment method: ' + error.message);
    }
  }

  async createCharge(
    customerId: string,
    amount: number,
    currency: string = 'usd',
    source?: string,
  ): Promise<Stripe.Charge> {
    try {
      const charge = await this.stripe.charges.create({
        amount,
        currency,
        customer: customerId,
        source,
      });
      return charge;
    } catch (error) {
      throw new Error('Error creating charge: ' + error.message);
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    paymentMethod?: string,
    customerId?: string,
    returnUrl?: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        payment_method: paymentMethod,
        customer: customerId,
        return_url: returnUrl,
      });
      return paymentIntent;
    } catch (error) {
      throw new Error('Error creating payment intent: ' + error.message);
    }
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
      );
      return paymentIntent;
    } catch (error) {
      throw new Error('Error confirming payment intent: ' + error.message);
    }
  }
  

  async retrievePaymentIntent(clientSecret: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(clientSecret);
      return paymentIntent;
    } catch (error) {
      throw new Error('Error retrieving payment intent: ' + error.message);
    }
  }

  async createSubscription(
    customerId: string,
    planId: string,
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ plan: planId }],
      });
      return subscription;
    } catch (error) {
      throw new Error('Error creating subscription: ' + error.message);
    }
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(
        subscriptionId,
      );
      return subscription;
    } catch (error) {
      throw new Error('Error retrieving subscription: ' + error.message);
    }
  }

  async cancelSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    try {
      const canceledSubscription = await this.stripe.subscriptions.cancel(subscriptionId);
      return canceledSubscription;
    } catch (error) {
      throw new Error('Error canceling subscription: ' + error.message);
    }
  }
}
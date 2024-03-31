import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
// import Stripe from 'stripe';
const {PaymentService,SubscriptionService,CustomerService} = require('integrate-stripe');
@Injectable()
export class StripeService1 {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripe) {}

  
  async getstripeConfig() {
    return {
      publishableKey: process.env.STRIPE_PUBLIC_KEY,config:this.stripe.config,
    };
  }

  async updateStripeConfig(config: any) {
    try{
      if(config.currency){
        this.stripe.setCurrency(config.currency);
      }
      if(config.paymentMethods){
        this.stripe.setPaymentMethods(config.paymentMethods);
      }
      if(config.apiVersion){
        this.stripe.setApiVersion(config.apiVersion);
      }
      if(config.webhookEnabled){
        this.stripe.enableWebhook(config.webhookUrl);
      }
      return this.stripe.config;
    }catch(error){
      throw new Error('Error updating stripe config: ' + error.message);
    }
  }

  async getAllCustomers(limit:number,startingAfter:number) {
    const customers = new CustomerService(this.stripe);
    try {
      const allCustomers = await customers.listCustomers(limit,startingAfter);
      return allCustomers;
    } catch (error) {
      throw new Error('Error retrieving customers: ' + error.message);
    }
  }

  async createCustomer(email: string, name?: string) {
    const customers = new CustomerService(this.stripe);
    try {
      const customer = await customers.createCustomer(email,{name});
      return customer;
    } catch (error) {
      throw new Error('Error creating customer: ' + error.message);
    }
  }


  async getCustomerById(customerId: string) {
    const customers = new CustomerService(this.stripe);
    try {
      const customer = await customers.getCustomerById(customerId);
      return customer;
    } catch (error) {
      throw new Error('Error retrieving customer: ' + error.message);
    }
  }

  async updateCustomer(
    customerId:string,
    updateParams: any,
  ) {
    const customers = new CustomerService(this.stripe);
    try {
      const updatedCustomer = await customers.updateCustomer(
        customerId,
        updateParams,
      );
      return updatedCustomer;
    } catch (error) {
      throw new Error('Error updating customer: ' + error.message);
    }
  }

  async deleteCustomer(customerId: string): Promise<{ message: string }> {
    const customers = new CustomerService(this.stripe);
    try {

      await customers.deleteCustomer(customerId);
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
  ) {
    const payments = new PaymentService(this.stripe);
    try {
      const paymentMethod = await payments.createPaymentMethod({
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

  async getPaymentMethod(paymentMethodId: string) {
    const payments=new PaymentService(this.stripe);
    try {
      const paymentMethod = await payments.getPaymentMethod(
        paymentMethodId,
      );
      return paymentMethod;
    } catch (error) {
      throw new Error('Error retrieving payment method: ' + error.message);
    }
  }


  async createPaymentIntent(
    amount: number,
    currency: string,
    paymentMethod?: string,
  ) {
    const payments = new PaymentService(this.stripe);
    try {
      const paymentIntent = await payments.createPaymentIntent(amount,currency,paymentMethod);
      return paymentIntent;
    } catch (error) {
      throw new Error('Error creating payment intent: ' + error.message);
    }
  }

  async capturePaymentIntent(
    paymentIntentId: string,
  ) {
    const payments = new PaymentService(this.stripe);
    try {
      const paymentIntent = await payments.capturePaymentIntent(
        paymentIntentId,
      );
      return paymentIntent;
    } catch (error) {
      throw new Error('Error capturing payment intent: ' + error.message);
    }
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
  ) {
    const payments = new PaymentService(this.stripe);
    try {
      const paymentIntent = await payments.confirmPaymentIntent(
        paymentIntentId,
      );
      return paymentIntent;
    } catch (error) {
      throw new Error('Error confirming payment intent: ' + error.message);
    }
  }
  

  async retrievePaymentIntent(paymentIntentId: string) {
    const payments = new PaymentService(this.stripe);

    try {
      const paymentIntent = await payments.retrievePaymentIntent(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new Error('Error retrieving payment intent: ' + error.message);
    }
  }

  async createSubscription(
    customerId: string,
    priceId: string,
  ) {
    const subscriptions = new SubscriptionService(this.stripe);
    try {
      const subscription = await subscriptions.createSubscription(customerId,priceId);
      return subscription;
    } catch (error) {
      throw new Error('Error creating subscription: ' + error.message);
    }
  }

  async getSubscription(subscriptionId: string){
    const subscriptions = new SubscriptionService(this.stripe);
    try {
      const subscription = await subscriptions.retrieveSubscription(
        subscriptionId,
      );
      return subscription;
    } catch (error) {
      throw new Error('Error retrieving subscription: ' + error.message);
    }
  }

  async cancelSubscription(
    subscriptionId: string,
  ){
    const subscriptions = new SubscriptionService(this.stripe);
    try {
      const canceledSubscription = await subscriptions.cancelSubscription(subscriptionId);
      return canceledSubscription;
    } catch (error) {
      throw new Error('Error canceling subscription: ' + error.message);
    }
  }
}
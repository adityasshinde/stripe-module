import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { StripeController } from './stripe.controller';
import { StripeService1 } from './stripe.service';
const stripe = require('integrate-stripe');


@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [StripeController],
  providers: [
    StripeService1,
    {
      provide: 'STRIPE_CLIENT',
      useFactory: () => {
        return new stripe.StripeService(process.env.STRIPE_API_KEY, {
          apiVersion: '2023-10-16',
        });
      },
    },
  ],
  exports: ['STRIPE_CLIENT',StripeService1],
})
export class StripeModule {
  
}

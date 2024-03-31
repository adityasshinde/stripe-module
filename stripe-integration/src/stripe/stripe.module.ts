import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { Stripe } from 'stripe';


@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [StripeController],
  providers: [
    StripeService,
    {
      provide: 'STRIPE_CLIENT',
      useFactory: () => {
        return new Stripe(process.env.STRIPE_API_KEY, {
          apiVersion: '2023-10-16',
        });
      },
    },
  ],
  exports: ['STRIPE_CLIENT',StripeService],
})
export class StripeModule {}

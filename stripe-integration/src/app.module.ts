import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StripeModule } from './stripe/stripe.module';
import { StripeController } from './stripe/stripe.controller';
import { StripeService1 } from './stripe/stripe.service';

@Module({
  imports: [StripeModule],
  controllers: [AppController,StripeController],
  providers: [AppService,StripeService1],
})
export class AppModule {}

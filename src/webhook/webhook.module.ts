import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { WebhookSchema, Webhook } from './webhook.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Webhook.name, schema: WebhookSchema }])],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Webhook } from './webhook.model';

@Injectable()
export class WebhookService {
  constructor(@InjectModel('Webhook') private readonly webhookModel: Model<Webhook>) {}

  async receiveData(data: any) {
    const newWebhookData = new this.webhookModel({ data: JSON.stringify(data) });
    return await newWebhookData.save();
  }
}

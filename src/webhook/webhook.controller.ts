import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async receiveData(@Body() body: any) {
    return this.webhookService.receiveData(body);
  }
}

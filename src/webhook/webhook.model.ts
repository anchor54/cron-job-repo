import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Webhook {
  @Prop()
  data: string;
  @Prop()
  receivedAt: Date;
}

export const WebhookSchema = SchemaFactory.createForClass(Webhook)
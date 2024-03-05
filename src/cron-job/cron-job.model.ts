import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum JobFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Schema({ timestamps: true })
export class CronJob {
  @Prop({ unique: true, required: true })
  name: string;
  @Prop({ required: true })
  triggerLink: string;
  @Prop({ required: false })
  apiKey?: string;
  @Prop({
    required: true,
    enum: Object.values(JobFrequency),
    default: JobFrequency.DAILY
  })
  schedule: string;
  @Prop({ required: true })
  startDate: Date;

  @Prop()
  createdAt?: Date;
  @Prop()
  updatedAt?: Date;
}

export const CronJobSchema = SchemaFactory.createForClass(CronJob)

@Schema({ timestamps: true })
export class CronHistory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: CronJob.name, required: true })
  cronId: CronJob;
  @Prop({ required: false })
  response?: string;

  @Prop()
  createdAt?: Date;
  @Prop()
  updatedAt?: Date;
}

export const CronHistorySchema = SchemaFactory.createForClass(CronHistory)
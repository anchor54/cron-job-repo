import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronJobModule } from './cron-job/cron-job.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    WebhookModule,
    CronJobModule,
    MongooseModule.forRoot(
      'mongodb://localhost:27017/yolo'
    ),
    ThrottlerModule.forRoot([
      { ttl: 5000, limit: 1 }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

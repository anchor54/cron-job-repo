import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CronJobController } from './cron-job.controller';
import { CronJobService } from './cron-job.service';
import { CronHistory, CronHistorySchema, CronJob, CronJobSchema } from './cron-job.model';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: CronJob.name, schema: CronJobSchema },
      { name: CronHistory.name, schema: CronHistorySchema }
    ]),
  ],
  controllers: [CronJobController],
  providers: [CronJobService],
})
export class CronJobModule {}

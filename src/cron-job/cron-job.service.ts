import { lastValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as cron from 'node-cron';
import { JobFrequency, CronJob, CronHistory } from './cron-job.model';
import { CreateCronJobDto, UpdateCronJobDto } from './cron-job.dto';


@Injectable()
export class CronJobService {
  private cronJobs = new Map<string, cron.ScheduleTask>()

  constructor(
    @InjectModel(CronJob.name) private readonly cronJobModel: Model<CronJob>,
    @InjectModel(CronHistory.name) private readonly cronHistoryModel: Model<CronHistory>,
    private readonly httpService: HttpService
  ) {}

  async create(createCronJobDto: CreateCronJobDto) {
    const createdCronJob = new this.cronJobModel(createCronJobDto);
    const cronJobModel = await createdCronJob.save();

    let cronSchedule = "0 0 0 0 0 0";
    const startDate = new Date(createCronJobDto.startDate)
    switch(createCronJobDto.schedule) {
      case JobFrequency.DAILY:
        cronSchedule = `${startDate.getSeconds()} ${startDate.getMinutes()} ${startDate.getHours()} * * *`
        break
      case JobFrequency.WEEKLY:
        cronSchedule = `${startDate.getSeconds()} ${startDate.getMinutes()} ${startDate.getHours()} * * ${startDate.getDay()}`
        break
      case JobFrequency.MONTHLY:
        cronSchedule = `${startDate.getSeconds()} ${startDate.getMinutes()} ${startDate.getHours()} ${startDate.getDate()} * *`
        break
      case JobFrequency.YEARLY:
        cronSchedule = `${startDate.getSeconds()} ${startDate.getMinutes()} ${startDate.getHours()} ${startDate.getDate()} ${startDate.getMonth()} *`
        break
    }

    this.scheduleCronJob(
      cronJobModel.id,
      cronSchedule,
      cronJobModel.triggerLink,
      Math.max(0, startDate.getTime() - Date.now())
    )
    
    return cronJobModel;
  }

  async update(id: string, updateCronJobDto: UpdateCronJobDto) {
    const updatedJobModel = await this.cronJobModel.findByIdAndUpdate(
      id,
      updateCronJobDto,
      { new: true }
    )
    const job = this.cronJobs.get(id)
    const link = updateCronJobDto.triggerLink ?? updatedJobModel.triggerLink
    const schedule = updateCronJobDto.schedule ?? updatedJobModel.schedule
    const delay = updateCronJobDto.startDate ? Math.max(0, new Date(updateCronJobDto.startDate).getTime() - Date.now()) : job.options.delay
    this.scheduleCronJob(id, link, schedule, delay)
    job.task.destroy()
    return updatedJobModel;
  }

  async delete(id: string) {
    this.cronJobs.get(id).task.destroy()
    this.cronJobs.delete(id)
    return await this.cronJobModel.findByIdAndDelete(id);
  }

  async get() {
    return await this.cronJobModel.find().exec();
  }

  private scheduleCronJob(id: string, schedule: string, triggerLink: string, delay: number) {
    const job = cron.schedule(
      schedule,
      async () => {
        try {
          const response = await lastValueFrom(this.httpService.get(triggerLink));
          const cronJob = await this.cronJobModel.findById(id);
          const cronHistory = new this.cronHistoryModel({ cronId: id, response: JSON.stringify(response.data) });
          await cronHistory.save()
        } catch (error) {
          console.error(`Error hitting URL ${triggerLink}: ${error.message}`);
        }
      },
      {
        scheduled: true,
        timezone: 'Asia/Kolkata',
        delay: delay
      }
    );
    this.cronJobs.set(id, job)
  }
}

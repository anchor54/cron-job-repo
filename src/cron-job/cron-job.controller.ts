import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CronJobService } from './cron-job.service';
import { CreateCronJobDto, UpdateCronJobDto } from './cron-job.dto';

@Controller('cron-jobs')
export class CronJobController {
  constructor(private readonly cronJobService: CronJobService) {}

  @Post()
  create(@Body() createCronJobDto: CreateCronJobDto) {
    return this.cronJobService.create(createCronJobDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCronJobDto: UpdateCronJobDto) {
    return this.cronJobService.update(id, updateCronJobDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cronJobService.delete(id);
  }

  @Get()
  findAll() {
    return this.cronJobService.get();
  }
}

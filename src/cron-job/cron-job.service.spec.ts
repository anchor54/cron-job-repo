import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { CronJobService } from './cron-job.service';
import { CronJob } from './cron-job.model';
import * as cron from 'node-cron';

jest.mock('node-cron');

describe('CronJobService', () => {
  let service: CronJobService;
  let model: any;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronJobService,
        {
          provide: getModelToken('CronJob'),
          useValue: {
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CronJobService>(CronJobService);
    model = module.get(getModelToken('CronJob'));
    httpService = module.get(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new cron job and schedule it', async () => {
    const createDto = {
      name: 'Test Job',
      triggerLink: 'https://dummyjson.com/products/1',
      apiKey: 'secret',
      schedule: '* * * * *',
      startDate: '2024-03-06T03:22:00.000Z',
    };
    const expectedJob = { ...createDto, _id: 'someId' };
  
    model.create.mockResolvedValue(expectedJob);
    const scheduleSpy = jest.spyOn(cron, 'schedule');
  
    const result = await service.create(createDto);
  
    expect(model.create).toHaveBeenCalledWith(createDto);
    expect(scheduleSpy).toHaveBeenCalledWith(createDto.schedule, expect.any(Function), expect.any(Object));
    expect(result).toEqual(expectedJob);
  });
  
  it('should update an existing cron job and reschedule it', async () => {
    const updateDto = {
      name: 'Updated Test Job',
    };
    const jobId = 'someJobId';
    const expectedJob = { ...updateDto, _id: jobId };
  
    model.findByIdAndUpdate.mockResolvedValue(expectedJob);
    const scheduleSpy = jest.spyOn(cron, 'schedule');
  
    const result = await service.update(jobId, updateDto);
  
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(jobId, updateDto, { new: true });
    expect(scheduleSpy).toHaveBeenCalledWith(expect.any(String), expect.any(Function), expect.any(Object));
    expect(result).toEqual(expectedJob);
  });
  
  it('should delete a cron job and cancel its schedule', async () => {
    const jobId = 'someJobId';
  
    model.findByIdAndRemove.mockResolvedValue(true);
  
    const result = await service.delete(jobId);
  
    expect(model.findByIdAndRemove).toHaveBeenCalledWith(jobId);
    expect(cron.schedule).toHaveBeenCalledTimes(0);
    expect(result).toEqual(true);
  });
  
  it('should return all cron jobs', async () => {
    const cronJobs = [
      { name: 'Job 1', schedule: '* * * * *' },
      { name: 'Job 2', schedule: '0 * * * *' },
    ];
  
    model.find.mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(cronJobs),
    });
  
    const result = await service.get();
  
    expect(model.find).toHaveBeenCalled();
    expect(result).toEqual(cronJobs);
  });
  
});

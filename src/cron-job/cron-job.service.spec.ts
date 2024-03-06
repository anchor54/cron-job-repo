import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CronJobService } from './cron-job.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CronJob, CronHistory } from './cron-job.model';
import { serialize } from 'v8';

jest.mock('node-cron');

describe('CronJobService', () => {
  let service: CronJobService;
  const cronJobModel = {
    create: jest.fn().mockResolvedValue(undefined),
    findByIdAndUpdate: jest.fn().mockResolvedValue(undefined),
    findByIdAndDelete: jest.fn().mockResolvedValue(undefined),
    find: jest.fn().mockResolvedValue(undefined),
  };
  let cronHistoryModel: Model<CronHistory>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronJobService,
        {
          provide: getModelToken(CronJob.name),
          useValue: cronJobModel,
        },
        {
          provide: getModelToken(CronHistory.name),
          useValue: {},
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
    cronHistoryModel = module.get(getModelToken(CronHistory.name));
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a cron job', async () => {
      const createCronJobDto = {
        name: 'Test Job',
        triggerLink: 'http://example.com',
        apiKey: 'secret',
        schedule: '0 * * * *',
        startDate: new Date(),
      } as any;
      const job = { ...createCronJobDto, id: 'someId@123' } as any
      jest.spyOn(cronJobModel, 'create').mockResolvedValue(job)

      expect(service.getCronJobs().size).toBe(0)
      const result = await service.create(createCronJobDto);
      expect(service.getCronJobs().size).toBe(1)

      expect(cronJobModel.create).toHaveBeenCalledWith(createCronJobDto);
      expect(result).toEqual(job);
    });
  });

  describe('update', () => {
    it('should successfully update a cron job', async () => {
      const updateCronJobDto = {
        name: 'Updated Test Job',
      };
      const jobId = 'someId@123';
      const job = {
        _id: jobId,
        name: 'Test Job',
        triggerLink: 'http://example.com',
        apiKey: 'secret',
        schedule: '0 * * * *',
        startDate: new Date()
      } as any
      jest.spyOn(cronJobModel, 'findByIdAndUpdate').mockResolvedValue(job)

      const result = await service.update(jobId, updateCronJobDto);

      expect(cronJobModel.findByIdAndUpdate).toHaveBeenCalledWith(jobId, updateCronJobDto, { new: true });
      expect(result).toEqual(job);
    });
  });

  describe('delete', () => {
    it('should successfully delete a cron job', async () => {
      const jobId = 'someJobId@123';
      const createCronJobDto = {
        name: 'Test Job',
        triggerLink: 'http://example.com',
        apiKey: 'secret',
        schedule: '0 * * * *',
        startDate: new Date(),
      };
      const job = { ...createCronJobDto, id: jobId }
      jest.spyOn(cronJobModel, 'findByIdAndDelete').mockResolvedValue(job);
      jest.spyOn(cronJobModel, 'create').mockResolvedValue(job)
      
      await service.create(createCronJobDto as any)
      expect(service.getCronJobs().size).toBe(1)
      const result = await service.delete(jobId);
      expect(service.getCronJobs().size).toBe(0)

      expect(cronJobModel.findByIdAndDelete).toHaveBeenCalledWith(jobId);
      expect(result).toEqual(job);
    });
  });

  describe('get', () => {
    it('should return all cron jobs', async () => {
      const cronJobs = [
        { _id: 'someId@123', name: 'Job 1', triggerLink: 'http://example.com', schedule: '* * * * *', startDate: new Date() },
        { _id: 'someId@456', name: 'Job 2', triggerLink: 'http://example.com', schedule: '0 * * * *', startDate: new Date() },
      ];
      jest.spyOn(cronJobModel, 'find').mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(cronJobs)
      }))

      const result = await service.get();

      expect(cronJobModel.find).toHaveBeenCalled();
      expect(result).toEqual(cronJobs);
    });
  });
});

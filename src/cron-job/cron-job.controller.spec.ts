import { Test, TestingModule } from '@nestjs/testing';
import { CronJobController } from './cron-job.controller';
import { CronJobService } from './cron-job.service';

describe('CronJobController', () => {
  let controller: CronJobController;
  let service: CronJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronJobController],
      providers: [
        {
          provide: CronJobService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CronJobController>(CronJobController);
    service = module.get<CronJobService>(CronJobService);
  });

  it('should create a new cron job', async () => {
    const createDto = {
      name: 'Test Job',
      triggerLink: 'http://example.com',
      apiKey: 'secret',
      schedule: '* * * * *',
      startDate: '2023-01-01T00:00:00.000Z',
    };
    const expectedJob = { ...createDto, _id: 'someId' } as any;
  
    jest.spyOn(service, 'create').mockResolvedValue(expectedJob);
  
    expect(await controller.create(createDto)).toEqual(expectedJob);
    expect(service.create).toHaveBeenCalledWith(createDto);
  });
  
  it('should update an existing cron job', async () => {
    const updateDto = {
      name: 'Updated Test Job',
    };
    const jobId = 'someJobId';
    const expectedJob = { ...updateDto, _id: jobId } as any;
  
    jest.spyOn(service, 'update').mockResolvedValue(expectedJob);
  
    expect(await controller.update(jobId, updateDto)).toEqual(expectedJob);
    expect(service.update).toHaveBeenCalledWith(jobId, updateDto);
  });
  
  it('should delete a cron job', async () => {
    const jobId = 'someJobId';
    const deletedJob = {
      _id: 'someid@123',
      name: 'Test Job',
      triggerLink: 'http://example.com',
      apiKey: 'secret',
      schedule: '* * * * *',
      startDate: '2023-01-01T00:00:00.000Z',
    } as any
    jest.spyOn(service, 'delete').mockResolvedValue(deletedJob);
    expect((await controller.delete(jobId))._id).toEqual('someid@123');
    expect(service.delete).toHaveBeenCalledWith(jobId);
  });

  it('should return all cron jobs', async () => {
    const cronJobs = [
      { name: 'Job 1', schedule: '* * * * *' },
      { name: 'Job 2', schedule: '0 * * * *' },
    ] as any;
  
    jest.spyOn(service, 'get').mockResolvedValue(cronJobs);
  
    expect(await controller.findAll()).toEqual(cronJobs);
    expect(service.get).toHaveBeenCalled();
  });
  
});

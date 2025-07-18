import { Test, TestingModule } from '@nestjs/testing';
import { HiringService } from './hiring.service';

describe('HiringService', () => {
  let service: HiringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HiringService],
    }).compile();

    service = module.get<HiringService>(HiringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

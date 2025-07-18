import { Test, TestingModule } from '@nestjs/testing';
import { HiringController } from './hiring.controller';

describe('HiringController', () => {
  let controller: HiringController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HiringController],
    }).compile();

    controller = module.get<HiringController>(HiringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

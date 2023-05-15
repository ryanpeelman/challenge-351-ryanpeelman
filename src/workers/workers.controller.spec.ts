import { Test, TestingModule } from '@nestjs/testing';
import { WorkersController } from './workers.controller';

describe('WorkersController', () => {
  let controller: WorkersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkersController],
    }).compile();

    controller = module.get<WorkersController>(WorkersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

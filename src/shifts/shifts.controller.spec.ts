import { Test, TestingModule } from '@nestjs/testing';
import { ShiftsController } from './shifts.controller';

describe('ShiftsController', () => {
  let controller: ShiftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShiftsController],
    }).compile();

    controller = module.get<ShiftsController>(ShiftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

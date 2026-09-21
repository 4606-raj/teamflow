import { Test, TestingModule } from '@nestjs/testing';
import { LookupController } from './lookups.controller';

describe('LookupsController', () => {
  let controller: LookupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LookupController],
    }).compile();

    controller = module.get<LookupController>(LookupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CreditosnpxService } from './creditosnpx.service';

describe('CreditosnpxService', () => {
  let service: CreditosnpxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditosnpxService],
    }).compile();

    service = module.get<CreditosnpxService>(CreditosnpxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

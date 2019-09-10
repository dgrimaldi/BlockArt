import { TestBed } from '@angular/core/testing';

import { BlockchainInjectionServiceService } from './blockchain-injection-service.service';

describe('BlockchainInjectionServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlockchainInjectionServiceService = TestBed.get(BlockchainInjectionServiceService);
    expect(service).toBeTruthy();
  });
});

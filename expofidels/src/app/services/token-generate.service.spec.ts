import { TestBed } from '@angular/core/testing';

import { TokenGenerateService } from './token-generate.service';

describe('TokenGenerateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TokenGenerateService = TestBed.get(TokenGenerateService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ZfillService } from './zfill.service';

describe('ZfillService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ZfillService = TestBed.get(ZfillService);
    expect(service).toBeTruthy();
  });
});

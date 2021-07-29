import { TestBed } from '@angular/core/testing';

import { TransferbodService } from './transferbod.service';

describe('TransferbodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransferbodService = TestBed.get(TransferbodService);
    expect(service).toBeTruthy();
  });
});

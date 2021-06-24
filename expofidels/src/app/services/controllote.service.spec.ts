import { TestBed } from '@angular/core/testing';

import { ControlloteService } from './controllote.service';

describe('ControlloteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ControlloteService = TestBed.get(ControlloteService);
    expect(service).toBeTruthy();
  });
});

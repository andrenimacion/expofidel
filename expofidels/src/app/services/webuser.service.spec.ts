import { TestBed } from '@angular/core/testing';

import { WebuserService } from './webuser.service';

describe('WebuserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebuserService = TestBed.get(WebuserService);
    expect(service).toBeTruthy();
  });
});

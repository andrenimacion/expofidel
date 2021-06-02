import { TestBed } from '@angular/core/testing';

import { PagonlineService } from './pagonline.service';

describe('PagonlineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PagonlineService = TestBed.get(PagonlineService);
    expect(service).toBeTruthy();
  });
});

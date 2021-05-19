import { TestBed } from '@angular/core/testing';

import { ControlprodService } from './controlprod.service';

describe('ControlprodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ControlprodService = TestBed.get(ControlprodService);
    expect(service).toBeTruthy();
  });
});

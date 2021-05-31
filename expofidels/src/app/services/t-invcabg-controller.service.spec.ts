import { TestBed } from '@angular/core/testing';

import { TInvcabgControllerService } from './t-invcabg-controller.service';

describe('TInvcabgControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TInvcabgControllerService = TestBed.get(TInvcabgControllerService);
    expect(service).toBeTruthy();
  });
});

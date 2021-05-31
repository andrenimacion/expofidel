import { TestBed } from '@angular/core/testing';

import { DatecontrolService } from './datecontrol.service';

describe('DatecontrolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatecontrolService = TestBed.get(DatecontrolService);
    expect(service).toBeTruthy();
  });
});

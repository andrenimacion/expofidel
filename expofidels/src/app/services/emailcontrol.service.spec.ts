import { TestBed } from '@angular/core/testing';

import { EmailcontrolService } from './emailcontrol.service';

describe('EmailcontrolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailcontrolService = TestBed.get(EmailcontrolService);
    expect(service).toBeTruthy();
  });
});

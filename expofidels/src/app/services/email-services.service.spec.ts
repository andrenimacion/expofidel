import { TestBed } from '@angular/core/testing';

import { EmailServicesService } from './email-services.service';

describe('EmailServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailServicesService = TestBed.get(EmailServicesService);
    expect(service).toBeTruthy();
  });
});

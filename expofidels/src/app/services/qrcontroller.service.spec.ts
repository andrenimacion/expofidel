import { TestBed } from '@angular/core/testing';

import { QrcontrollerService } from './qrcontroller.service';

describe('QrcontrollerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QrcontrollerService = TestBed.get(QrcontrollerService);
    expect(service).toBeTruthy();
  });
});

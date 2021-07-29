import { TestBed } from '@angular/core/testing';

import { TransaccionService } from './transaccion.service';

describe('TransaccionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransaccionService = TestBed.get(TransaccionService);
    expect(service).toBeTruthy();
  });
});

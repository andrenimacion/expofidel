import { TestBed } from '@angular/core/testing';

import { TipoControlEmpService } from './tipo-control-emp.service';

describe('TipoControlEmpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipoControlEmpService = TestBed.get(TipoControlEmpService);
    expect(service).toBeTruthy();
  });
});

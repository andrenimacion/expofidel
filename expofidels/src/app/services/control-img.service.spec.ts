import { TestBed } from '@angular/core/testing';

import { ControlImgService } from './control-img.service';

describe('ControlImgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ControlImgService = TestBed.get(ControlImgService);
    expect(service).toBeTruthy();
  });
});

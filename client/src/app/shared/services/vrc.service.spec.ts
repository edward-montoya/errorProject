import { TestBed } from '@angular/core/testing';

import { VrcService } from './vrc.service';

describe('VrcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VrcService = TestBed.get(VrcService);
    expect(service).toBeTruthy();
  });
});

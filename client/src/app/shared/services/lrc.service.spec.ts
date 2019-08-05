import { TestBed } from '@angular/core/testing';

import { LrcService } from './lrc.service';

describe('LrcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LrcService = TestBed.get(LrcService);
    expect(service).toBeTruthy();
  });
});

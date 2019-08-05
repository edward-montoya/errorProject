import { TestBed } from '@angular/core/testing';

import { CrcService } from './crc.service';

describe('CrcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrcService = TestBed.get(CrcService);
    expect(service).toBeTruthy();
  });
});

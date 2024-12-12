import { TestBed } from '@angular/core/testing';

import { EnrollProgramService } from './enroll-program.service';

describe('EnrollProgramService', () => {
  let service: EnrollProgramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollProgramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

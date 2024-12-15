import { TestBed } from '@angular/core/testing';

import { WorkouplanService } from './workouplan.service';

describe('WorkouplanService', () => {
  let service: WorkouplanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkouplanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

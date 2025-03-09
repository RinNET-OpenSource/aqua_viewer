import { TestBed } from '@angular/core/testing';

import { ReleaseTagService } from './release-tag.service';

describe('ReleaseTagService', () => {
  let service: ReleaseTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReleaseTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

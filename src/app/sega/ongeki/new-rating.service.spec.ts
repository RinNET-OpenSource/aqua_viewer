import { TestBed } from '@angular/core/testing';

import { NewRatingService } from './new-rating.service';

describe('RatingService', () => {
  let service: NewRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

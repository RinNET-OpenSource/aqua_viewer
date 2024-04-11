import { TestBed } from '@angular/core/testing';

import { WebauthnService } from './webauthn.service';

describe('WebauthnService', () => {
  let service: WebauthnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebauthnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

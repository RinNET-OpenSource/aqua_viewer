import { TestBed } from '@angular/core/testing';

import { GithubOauth2Service } from './github-oauth2.service';

describe('GithubOauth2Service', () => {
  let service: GithubOauth2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GithubOauth2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

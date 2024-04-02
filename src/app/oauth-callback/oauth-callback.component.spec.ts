import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthCallbackComponent } from './oauth-callback.component';

describe('OauthCallbackComponent', () => {
  let component: OauthCallbackComponent;
  let fixture: ComponentFixture<OauthCallbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OauthCallbackComponent]
    });
    fixture = TestBed.createComponent(OauthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthButtonComponent } from './oauth-button.component';

describe('OauthButtonComponent', () => {
  let component: OauthButtonComponent;
  let fixture: ComponentFixture<OauthButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OauthButtonComponent]
    });
    fixture = TestBed.createComponent(OauthButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

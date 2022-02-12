import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AmazonProfileComponent} from './amazon-profile.component';

describe('AmazonProfileComponent', () => {
  let component: AmazonProfileComponent;
  let fixture: ComponentFixture<AmazonProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AmazonProfileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmazonProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

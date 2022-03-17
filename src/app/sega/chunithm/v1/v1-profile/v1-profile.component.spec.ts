import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V1ProfileComponent} from './v1-profile.component';

describe('V1ProfileComponent', () => {
  let component: V1ProfileComponent;
  let fixture: ComponentFixture<V1ProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V1ProfileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V1ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

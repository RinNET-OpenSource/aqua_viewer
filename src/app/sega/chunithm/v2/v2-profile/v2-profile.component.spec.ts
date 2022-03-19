import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V2ProfileComponent} from './v2-profile.component';

describe('V2ProfileComponent', () => {
  let component: V2ProfileComponent;
  let fixture: ComponentFixture<V2ProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V2ProfileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

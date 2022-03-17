import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V1RecentComponent} from './v1-recent.component';

describe('V1RecentComponent', () => {
  let component: V1RecentComponent;
  let fixture: ComponentFixture<V1RecentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V1RecentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V1RecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

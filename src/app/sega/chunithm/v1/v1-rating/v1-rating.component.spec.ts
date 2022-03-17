import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V1RatingComponent} from './v1-rating.component';

describe('V1RatingComponent', () => {
  let component: V1RatingComponent;
  let fixture: ComponentFixture<V1RatingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V1RatingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V1RatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

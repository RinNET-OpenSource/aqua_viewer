import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V2RatingComponent} from './v2-rating.component';

describe('V2RatingComponent', () => {
  let component: V2RatingComponent;
  let fixture: ComponentFixture<V2RatingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V2RatingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2RatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

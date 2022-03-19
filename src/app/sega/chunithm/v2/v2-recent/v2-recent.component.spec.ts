import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V2RecentComponent} from './v2-recent.component';

describe('V2RecentComponent', () => {
  let component: V2RecentComponent;
  let fixture: ComponentFixture<V2RecentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V2RecentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2RecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DivaRecentComponent} from './diva-recent.component';

describe('DivaRecentComponent', () => {
  let component: DivaRecentComponent;
  let fixture: ComponentFixture<DivaRecentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DivaRecentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivaRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

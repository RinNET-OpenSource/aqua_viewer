import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DivaContestComponent} from './diva-contest.component';

describe('DivaContestComponent', () => {
  let component: DivaContestComponent;
  let fixture: ComponentFixture<DivaContestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DivaContestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivaContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

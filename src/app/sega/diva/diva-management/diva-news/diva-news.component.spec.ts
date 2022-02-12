import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DivaNewsComponent} from './diva-news.component';

describe('DivaNewsComponent', () => {
  let component: DivaNewsComponent;
  let fixture: ComponentFixture<DivaNewsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DivaNewsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivaNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

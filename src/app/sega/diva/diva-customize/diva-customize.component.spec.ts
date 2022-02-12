import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DivaCustomizeComponent} from './diva-customize.component';

describe('DivaCustomizeComponent', () => {
  let component: DivaCustomizeComponent;
  let fixture: ComponentFixture<DivaCustomizeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DivaCustomizeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivaCustomizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

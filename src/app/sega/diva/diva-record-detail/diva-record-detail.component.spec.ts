import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DivaRecordDetailComponent} from './diva-record-detail.component';

describe('DivaRecordDetailComponent', () => {
  let component: DivaRecordDetailComponent;
  let fixture: ComponentFixture<DivaRecordDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DivaRecordDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivaRecordDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

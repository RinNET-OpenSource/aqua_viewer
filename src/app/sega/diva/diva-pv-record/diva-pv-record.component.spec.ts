import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DivaPvRecordComponent} from './diva-pv-record.component';

describe('DivaPvRecordComponent', () => {
  let component: DivaPvRecordComponent;
  let fixture: ComponentFixture<DivaPvRecordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DivaPvRecordComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivaPvRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

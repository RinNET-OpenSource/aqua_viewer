import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DivaManagementComponent} from './diva-management.component';

describe('DivaManagementComponent', () => {
  let component: DivaManagementComponent;
  let fixture: ComponentFixture<DivaManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DivaManagementComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivaManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

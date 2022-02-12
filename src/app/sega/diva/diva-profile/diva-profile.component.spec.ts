import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DivaProfileComponent} from './diva-profile.component';

describe('DivaProfileComponent', () => {
  let component: DivaProfileComponent;
  let fixture: ComponentFixture<DivaProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DivaProfileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivaProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

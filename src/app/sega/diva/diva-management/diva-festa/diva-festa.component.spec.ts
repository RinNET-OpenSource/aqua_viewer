import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DivaFestaComponent} from './diva-festa.component';

describe('DivaFestaComponent', () => {
  let component: DivaFestaComponent;
  let fixture: ComponentFixture<DivaFestaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DivaFestaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivaFestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DivaFestaEditComponent} from './diva-festa-edit.component';

describe('DivaFestaEditComponent', () => {
  let component: DivaFestaEditComponent;
  let fixture: ComponentFixture<DivaFestaEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DivaFestaEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivaFestaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

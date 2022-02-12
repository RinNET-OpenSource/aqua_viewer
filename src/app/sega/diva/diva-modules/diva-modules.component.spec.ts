import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DivaModulesComponent} from './diva-modules.component';

describe('DivaModulesComponent', () => {
  let component: DivaModulesComponent;
  let fixture: ComponentFixture<DivaModulesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DivaModulesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivaModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

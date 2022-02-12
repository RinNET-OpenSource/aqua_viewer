import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DivaSettingComponent} from './diva-setting.component';

describe('DivaSettingComponent', () => {
  let component: DivaSettingComponent;
  let fixture: ComponentFixture<DivaSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DivaSettingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivaSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

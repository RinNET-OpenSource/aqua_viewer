import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {Maimai2SettingComponent} from './maimai2-setting.component';

describe('Maimai2SettingComponent', () => {
  let component: Maimai2SettingComponent;
  let fixture: ComponentFixture<Maimai2SettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Maimai2SettingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Maimai2SettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

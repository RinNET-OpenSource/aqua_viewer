import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { V1SettingComponent } from './v1-setting.component';

describe('V1SettingComponent', () => {
  let component: V1SettingComponent;
  let fixture: ComponentFixture<V1SettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ V1SettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V1SettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

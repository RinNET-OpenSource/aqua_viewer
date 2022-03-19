import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { V2SettingComponent } from './v2-setting.component';

describe('V2SettingComponent', () => {
  let component: V2SettingComponent;
  let fixture: ComponentFixture<V2SettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ V2SettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2SettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {OngekiProfileComponent} from './ongeki-profile.component';

describe('OngekiProfileComponent', () => {
  let component: OngekiProfileComponent;
  let fixture: ComponentFixture<OngekiProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OngekiProfileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngekiProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

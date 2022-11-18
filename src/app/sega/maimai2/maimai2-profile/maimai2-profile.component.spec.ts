import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {Maimai2ProfileComponent} from './maimai2-profile.component';

describe('Maimai2ProfileComponent', () => {
  let component: Maimai2ProfileComponent;
  let fixture: ComponentFixture<Maimai2ProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Maimai2ProfileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Maimai2ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

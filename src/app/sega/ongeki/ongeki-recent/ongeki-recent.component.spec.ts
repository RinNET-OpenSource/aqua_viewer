import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {OngekiRecentComponent} from './ongeki-recent.component';

describe('OngekiRecentComponent', () => {
  let component: OngekiRecentComponent;
  let fixture: ComponentFixture<OngekiRecentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OngekiRecentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngekiRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

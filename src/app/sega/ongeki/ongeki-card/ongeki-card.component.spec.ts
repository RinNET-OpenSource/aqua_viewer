import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {OngekiCardComponent} from './ongeki-card.component';

describe('OngekiCardComponent', () => {
  let component: OngekiCardComponent;
  let fixture: ComponentFixture<OngekiCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OngekiCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngekiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

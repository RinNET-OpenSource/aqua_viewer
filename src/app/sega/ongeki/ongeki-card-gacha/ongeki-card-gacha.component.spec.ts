import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {OngekiCardGachaComponent} from './ongeki-card-gacha.component';

describe('OngekiCardGachaComponent', () => {
  let component: OngekiCardGachaComponent;
  let fixture: ComponentFixture<OngekiCardGachaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OngekiCardGachaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngekiCardGachaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

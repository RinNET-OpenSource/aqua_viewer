import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {OngekiBattlePointComponent} from './ongeki-battle-point.component';

describe('OngekiBattlePointComponent', () => {
  let component: OngekiBattlePointComponent;
  let fixture: ComponentFixture<OngekiBattlePointComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OngekiBattlePointComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngekiBattlePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

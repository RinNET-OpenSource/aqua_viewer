import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {OngekiRivalListComponent} from './ongeki-rival-list.component';

describe('OngekiRivalListComponent', () => {
  let component: OngekiRivalListComponent;
  let fixture: ComponentFixture<OngekiRivalListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OngekiRivalListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngekiRivalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

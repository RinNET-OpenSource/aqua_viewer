import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngekiCardComponent } from './ongeki-card.component';

describe('OngekiCardComponent', () => {
  let component: OngekiCardComponent;
  let fixture: ComponentFixture<OngekiCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OngekiCardComponent]
    });
    fixture = TestBed.createComponent(OngekiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngekiCardItemComponent } from './ongeki-card-item.component';

describe('OngekiCardItemComponent', () => {
  let component: OngekiCardItemComponent;
  let fixture: ComponentFixture<OngekiCardItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OngekiCardItemComponent]
    });
    fixture = TestBed.createComponent(OngekiCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

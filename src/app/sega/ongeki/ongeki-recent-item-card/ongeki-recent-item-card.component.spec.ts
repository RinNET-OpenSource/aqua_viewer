import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngekiRecentItemCardComponent } from './ongeki-recent-item-card.component';

describe('OngekiRecentItemCardComponent', () => {
  let component: OngekiRecentItemCardComponent;
  let fixture: ComponentFixture<OngekiRecentItemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngekiRecentItemCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngekiRecentItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

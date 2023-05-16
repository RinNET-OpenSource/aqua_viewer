import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngekiRecentItemComponent } from './ongeki-recent-item.component';

describe('OngekiRecentItemComponent', () => {
  let component: OngekiRecentItemComponent;
  let fixture: ComponentFixture<OngekiRecentItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngekiRecentItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngekiRecentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

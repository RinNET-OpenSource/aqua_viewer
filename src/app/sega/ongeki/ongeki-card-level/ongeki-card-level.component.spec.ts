import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngekiCardLevelComponent } from './ongeki-card-level.component';

describe('OngekiCardLevelComponent', () => {
  let component: OngekiCardLevelComponent;
  let fixture: ComponentFixture<OngekiCardLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngekiCardLevelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngekiCardLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

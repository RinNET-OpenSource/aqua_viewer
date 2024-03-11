import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngekiPcRankingComponent } from './ongeki-pc-ranking.component';

describe('OngekiPcRankingComponent', () => {
  let component: OngekiPcRankingComponent;
  let fixture: ComponentFixture<OngekiPcRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngekiPcRankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OngekiPcRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

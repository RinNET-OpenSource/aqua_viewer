import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngekiMusicRankingComponent } from './ongeki-music-ranking.component';

describe('OngekiMusicRankingComponent', () => {
  let component: OngekiMusicRankingComponent;
  let fixture: ComponentFixture<OngekiMusicRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngekiMusicRankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OngekiMusicRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

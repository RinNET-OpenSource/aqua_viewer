import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngekiSongScoreRankingComponent } from './ongeki-song-score-ranking.component';

describe('OngekiSongScoreRankingComponent', () => {
  let component: OngekiSongScoreRankingComponent;
  let fixture: ComponentFixture<OngekiSongScoreRankingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OngekiSongScoreRankingComponent]
    });
    fixture = TestBed.createComponent(OngekiSongScoreRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

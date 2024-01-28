import { ComponentFixture, TestBed } from '@angular/core/testing';

import { V2SongScoreRankingComponent } from './v2-song-score-ranking.component';

describe('V2SongScoreRankingComponent', () => {
  let component: V2SongScoreRankingComponent;
  let fixture: ComponentFixture<V2SongScoreRankingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [V2SongScoreRankingComponent]
    });
    fixture = TestBed.createComponent(V2SongScoreRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

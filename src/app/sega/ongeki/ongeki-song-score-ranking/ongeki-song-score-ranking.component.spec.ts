import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngekiSongScroeRankingComponent } from './ongeki-song-scroe-ranking.component';

describe('OngekiSongScroeRankingComponent', () => {
  let component: OngekiSongScroeRankingComponent;
  let fixture: ComponentFixture<OngekiSongScroeRankingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OngekiSongScroeRankingComponent]
    });
    fixture = TestBed.createComponent(OngekiSongScroeRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Maimai2SongDetailComponent } from './maimai2-song-detail.component';

describe('V2SongScoreRankingComponent', () => {
  let component: Maimai2SongDetailComponent;
  let fixture: ComponentFixture<Maimai2SongDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Maimai2SongDetailComponent]
    });
    fixture = TestBed.createComponent(Maimai2SongDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

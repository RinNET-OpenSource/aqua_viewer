import { ComponentFixture, TestBed } from '@angular/core/testing';

import { V2UserRankingComponent } from './v2-user-ranking.component';

describe('V2UserRankingComponent', () => {
  let component: V2UserRankingComponent;
  let fixture: ComponentFixture<V2UserRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ V2UserRankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(V2UserRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

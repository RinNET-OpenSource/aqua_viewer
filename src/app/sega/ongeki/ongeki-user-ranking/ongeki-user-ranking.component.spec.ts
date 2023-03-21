import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngekiUserRankingComponent } from './ongeki-user-ranking.component';

describe('OngekiUserRankingComponent', () => {
  let component: OngekiUserRankingComponent;
  let fixture: ComponentFixture<OngekiUserRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngekiUserRankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OngekiUserRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

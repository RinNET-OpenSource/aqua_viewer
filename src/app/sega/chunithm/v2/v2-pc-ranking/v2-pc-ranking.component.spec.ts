import { ComponentFixture, TestBed } from '@angular/core/testing';

import { V2PcRankingComponent } from './v2-pc-ranking.component';

describe('V2PcRankingComponent', () => {
  let component: V2PcRankingComponent;
  let fixture: ComponentFixture<V2PcRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ V2PcRankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(V2PcRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

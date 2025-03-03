import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Maimai2SonglistComponent } from './maimai2-songlist.component';

describe('Maimai2SonglistComponent', () => {
  let component: Maimai2SonglistComponent;
  let fixture: ComponentFixture<Maimai2SonglistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Maimai2SonglistComponent]
    });
    fixture = TestBed.createComponent(Maimai2SonglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

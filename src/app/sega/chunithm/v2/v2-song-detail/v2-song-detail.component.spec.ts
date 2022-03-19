import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V2SongDetailComponent} from './v2-song-detail.component';

describe('V2SongDetailComponent', () => {
  let component: V2SongDetailComponent;
  let fixture: ComponentFixture<V2SongDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V2SongDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2SongDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

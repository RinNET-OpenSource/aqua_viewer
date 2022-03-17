import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V1SongDetailComponent} from './v1-song-detail.component';

describe('V1SongDetailComponent', () => {
  let component: V1SongDetailComponent;
  let fixture: ComponentFixture<V1SongDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V1SongDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V1SongDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

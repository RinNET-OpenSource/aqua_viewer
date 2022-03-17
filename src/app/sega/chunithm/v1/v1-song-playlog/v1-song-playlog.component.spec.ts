import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V1SongPlaylogComponent} from './v1-song-playlog.component';

describe('V1SongPlaylogComponent', () => {
  let component: V1SongPlaylogComponent;
  let fixture: ComponentFixture<V1SongPlaylogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V1SongPlaylogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V1SongPlaylogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

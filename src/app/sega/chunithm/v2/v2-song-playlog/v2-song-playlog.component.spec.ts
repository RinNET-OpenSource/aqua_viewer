import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V2SongPlaylogComponent} from './v2-song-playlog.component';

describe('V2SongPlaylogComponent', () => {
  let component: V2SongPlaylogComponent;
  let fixture: ComponentFixture<V2SongPlaylogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V2SongPlaylogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2SongPlaylogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {OngekiSongListComponent} from './ongeki-song-list.component';

describe('OngekiSongListComponent', () => {
  let component: OngekiSongListComponent;
  let fixture: ComponentFixture<OngekiSongListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OngekiSongListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngekiSongListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

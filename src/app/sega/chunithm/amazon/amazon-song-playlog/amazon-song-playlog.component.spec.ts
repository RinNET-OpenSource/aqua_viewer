import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AmazonSongPlaylogComponent} from './amazon-song-playlog.component';

describe('AmazonSongPlaylogComponent', () => {
  let component: AmazonSongPlaylogComponent;
  let fixture: ComponentFixture<AmazonSongPlaylogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AmazonSongPlaylogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmazonSongPlaylogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

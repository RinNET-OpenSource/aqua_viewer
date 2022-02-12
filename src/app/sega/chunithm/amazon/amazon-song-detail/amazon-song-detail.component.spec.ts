import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AmazonSongDetailComponent} from './amazon-song-detail.component';

describe('AmazonSongDetailComponent', () => {
  let component: AmazonSongDetailComponent;
  let fixture: ComponentFixture<AmazonSongDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AmazonSongDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmazonSongDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

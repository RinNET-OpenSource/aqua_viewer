import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AmazonSonglistComponent} from './amazon-songlist.component';

describe('AmazonSonglistComponent', () => {
  let component: AmazonSonglistComponent;
  let fixture: ComponentFixture<AmazonSonglistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AmazonSonglistComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmazonSonglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

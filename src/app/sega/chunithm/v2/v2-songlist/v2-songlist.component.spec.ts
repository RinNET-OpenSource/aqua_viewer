import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V2SonglistComponent} from './v2-songlist.component';

describe('V2SonglistComponent', () => {
  let component: V2SonglistComponent;
  let fixture: ComponentFixture<V2SonglistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V2SonglistComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2SonglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

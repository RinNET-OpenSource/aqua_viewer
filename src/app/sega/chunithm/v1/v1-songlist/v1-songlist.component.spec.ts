import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V1SonglistComponent} from './v1-songlist.component';

describe('V1SonglistComponent', () => {
  let component: V1SonglistComponent;
  let fixture: ComponentFixture<V1SonglistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V1SonglistComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V1SonglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

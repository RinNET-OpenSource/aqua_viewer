import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V1CharacterComponent} from './v1-character.component';

describe('V1CharacterComponent', () => {
  let component: V1CharacterComponent;
  let fixture: ComponentFixture<V1CharacterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V1CharacterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V1CharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {V2CharacterComponent} from './v2-character.component';

describe('V2CharacterComponent', () => {
  let component: V2CharacterComponent;
  let fixture: ComponentFixture<V2CharacterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [V2CharacterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2CharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

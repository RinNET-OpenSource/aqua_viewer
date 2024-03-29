import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeychipComponent } from './keychip.component';

describe('KeychipComponent', () => {
  let component: KeychipComponent;
  let fixture: ComponentFixture<KeychipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeychipComponent]
    });
    fixture = TestBed.createComponent(KeychipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

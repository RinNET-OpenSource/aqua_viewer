import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Maimai2DxpassComponent } from './maimai2-dxpass.component';

describe('Maimai2DxpassComponent', () => {
  let component: Maimai2DxpassComponent;
  let fixture: ComponentFixture<Maimai2DxpassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Maimai2DxpassComponent]
    });
    fixture = TestBed.createComponent(Maimai2DxpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

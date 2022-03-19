import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { V2UserBoxComponent } from './v2-userbox.component';

describe('V2UserBoxComponent', () => {
  let component: V2UserBoxComponent;
  let fixture: ComponentFixture<V2UserBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ V2UserBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2UserBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

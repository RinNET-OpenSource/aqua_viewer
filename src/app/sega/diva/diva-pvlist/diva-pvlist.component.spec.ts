import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DivaPvlistComponent } from './diva-pvlist.component';

describe('DivaPvlistComponent', () => {
  let component: DivaPvlistComponent;
  let fixture: ComponentFixture<DivaPvlistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DivaPvlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivaPvlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

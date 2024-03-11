import { ComponentFixture, TestBed } from '@angular/core/testing';

import { V2RivalListComponent } from './v2-rival-list.component';

describe('V2RivalListComponent', () => {
  let component: V2RivalListComponent;
  let fixture: ComponentFixture<V2RivalListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [V2RivalListComponent]
    });
    fixture = TestBed.createComponent(V2RivalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ImporterComponent} from './importer.component';

describe('ImporterComponent', () => {
  let component: ImporterComponent;
  let fixture: ComponentFixture<ImporterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImporterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

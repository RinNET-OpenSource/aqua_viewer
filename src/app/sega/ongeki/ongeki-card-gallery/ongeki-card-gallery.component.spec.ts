import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {OngekiCardGalleryComponent} from './ongeki-card-gallery.component';

describe('OngekiCardComponent', () => {
  let component: OngekiCardGalleryComponent;
  let fixture: ComponentFixture<OngekiCardGalleryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OngekiCardGalleryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngekiCardGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';

import {LoginComponent} from './login.component';
import {AppRoutingModule} from '../app-routing.module';
import {LayoutModule} from '@angular/cdk/layout';
import {DashboardModule} from '../dashboard/dashboard.module';
import {HttpClientModule} from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        LayoutModule,
        FormsModule,
        AppRoutingModule,

        HttpClientModule,
        DashboardModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it(`form should be invalid`, waitForAsync(() => {
    component.loginForm.controls.email.setValue('');
    component.loginForm.controls.password.setValue('');
    expect(component.loginForm.invalid).toBeTruthy();
  }));

  it(`form should be valid`, waitForAsync(() => {
    component.loginForm.controls.email.setValue('test@eamil.com');
    component.loginForm.controls.password.setValue('12345');
    expect(component.loginForm.invalid).toBeFalsy();
  }));
});

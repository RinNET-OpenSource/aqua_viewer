import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {MessageService} from '../message.service';
import {AuthenticationService} from '../auth/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    public router: Router) {

  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', [
        Validators.required,
        Validators.pattern('^((?![a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*).)*$')]],
      email: ['', [
        Validators.required,
        Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)]],
      confirmPassword: ['']
    }, { validators: this.checkPasswords });
  }

  get name() {
    return this.signUpForm.get('name');
  }

  get username() {
    return this.signUpForm.get('username');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  checkPasswords: ValidatorFn = (group: FormGroup) => {
    const password = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return password === confirmPass ? null : {notSame: true};
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    this.signUpForm.disable();
    const value = this.signUpForm.value;

    this.authenticationService.signUp(value.name, value.username, value.email, value.password).pipe(first())
      .subscribe(
        {
          next: (data) => {
            if (data && data.message) {
              this.messageService.notice(data.message);
            }
            if (data && data.success) {
              this.router.navigate(['login']);
            }
          }
          ,
          error: (error) => {
            if (error) {
              this.messageService.notice(error);
            }
            this.signUpForm.enable();
            console.warn('login fail', error);
          }
        }
      );

  }
}

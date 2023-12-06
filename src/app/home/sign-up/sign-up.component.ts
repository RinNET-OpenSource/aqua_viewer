import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {MessageService} from '../../message.service';
import {AuthenticationService} from '../../auth/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup;
  getVerifyCodeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    public router: Router) {

  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40)]],
      username: ['', [
        Validators.required,
        Validators.pattern('^((?![a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*).)*$'),
        Validators.minLength(3),
        Validators.maxLength(15)]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(40)]],
      verifyCode: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)]],
      confirmPassword: ['']
    }, { validators: this.checkPasswords });
    this.getVerifyCodeForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(40)]]
    });
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

  get verifyCode() {
    return this.signUpForm.get('verifyCode');
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

  getVerifyCode(){
    if (this.email.invalid) {
      this.email.markAsTouched();
      return;
    }
    this.getVerifyCodeForm.disable();
    const value = this.email.value;

    this.authenticationService.getVerifyCode(value).pipe(first())
      .subscribe(
        {
          next: (data) => {
            if (data && data.message) {
              this.messageService.notice(data.message);
            }
          }
          ,
          error: (error) => {
            if (error) {
              this.messageService.notice(error);
            }
            this.getVerifyCodeForm.enable();
            console.warn('get verify code fail', error);
          }
        }
      );
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    this.signUpForm.disable();
    const value = this.signUpForm.value;

    this.authenticationService.signUp(value.name, value.username, value.email, value.verifyCode, value.password).pipe(first())
      .subscribe(
        {
          next: (data) => {
            if (data && data.message) {
              this.messageService.notice(data.message);
            }
            if (data && data.success) {
              window.location.reload();
              // login
            }
          }
          ,
          error: (error) => {
            if (error) {
              this.messageService.notice(error);
            }
            this.signUpForm.enable();
            console.warn('sign up fail', error);
          }
        }
      );
  }
}

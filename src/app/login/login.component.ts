import {Router} from '@angular/router';
import {AuthenticationService} from '../auth/authentication.service';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from '../message.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) {
  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      accessCode: ['', Validators.required],
      apiServer: ['http://localhost:80', Validators.required],
    });
    if (this.authenticationService.currentUserValue) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    let server: string = this.f.apiServer.value;
    if (!server.startsWith('http')) {
      server = 'http://' + server;
    }

    if (server.endsWith('/')) {
      server = server.substring(0, server.length - 1);
    }

    this.authenticationService.login(this.f.accessCode.value, server).pipe(first())
      .subscribe(
        data => {
          if (data != null) {
            this.messageService.notice('OK');
            location.reload();
          } else {
            this.messageService.notice('No such Card');
          }
        },
        error => {
          this.messageService.notice(error.message);
          console.warn('login fail', error);
        }
      );

  }
}

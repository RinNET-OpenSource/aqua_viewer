import {Router} from '@angular/router';
import {AuthenticationService} from '../auth/authentication.service';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {first, map} from 'rxjs/operators';
import {MessageService} from '../message.service';

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
    public messageService: MessageService
  ) {
  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      accessCode: ['', Validators.required],
      apiServer: ['https://portal.naominet.live', Validators.required],
    });
    if (this.authenticationService.currentUserValue) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.authenticationService.login(form.value.usernameOrEmail, form.value.password)
      .subscribe(
        {
          next: (data) => {
            if (data != null) {
              this.messageService.notice('Logging in');
              location.reload();
            } else {
              this.messageService.notice('Card you entered does not exist');
            }
          },
          error: (error) => {
            this.messageService.notice(error);
            console.warn('login fail', error);
          }
        }
      );
  }

  // onSubmit() {
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  //
  //   let server: string = this.f.apiServer.value;
  //   if (!server.startsWith('http')) {
  //     server = 'http://' + server;
  //   }
  //
  //   if (server.endsWith('/')) {
  //     server = server.substring(0, server.length - 1);
  //   }
  //
  //   this.authenticationService.login(this.f.accessCode.value, server).pipe(first())
  //     .subscribe(
  //       {
  //         next: (data) => {
  //           if (data != null) {
  //             this.messageService.notice('Logging in');
  //             location.reload();
  //           } else {
  //             this.messageService.notice('Card you entered does not exist');
  //           }
  //         }
  //         ,
  //         error: (error) => {
  //           this.messageService.notice(error.message);
  //           console.warn('login fail', error);
  //         }
  //       }
  //     );
  //
  // }
}

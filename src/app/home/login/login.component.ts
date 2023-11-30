import { Router } from "@angular/router";
import { AuthenticationService } from "../../auth/authentication.service";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { first, map } from "rxjs/operators";
import { MessageService } from "../../message.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  signInForm: FormGroup;
  signInSubmitTouched = false;
  @Output() onForgotPassword = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    public messageService: MessageService
  ) {}

  get usernameOrEmail() {
    return this.signInForm.get("usernameOrEmail");
  }

  get password() {
    return this.signInForm.get("password");
  }

  ngOnInit() {
    this.signInForm = this.fb.group({
      usernameOrEmail: ["", Validators.required],
      password: ["", Validators.required],
    });
    if (this.authenticationService.currentUserValue) {
      this.router.navigateByUrl("/dashboard");
    }
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      this.signInSubmitTouched = true;
      this.signInForm.markAllAsTouched();
      return;
    }
    this.signInForm.disable();
    const value = this.signInForm.value;

    this.authenticationService
      .login(value.usernameOrEmail, value.password)
      .subscribe({
        next: (data) => {
          if (data != null) {
            this.messageService.notice("Logging in");
            location.reload();
          } else {
            this.messageService.notice("Card you entered does not exist");
          }
        },
        error: (error) => {
          this.messageService.notice(error);
          this.signInForm.enable();
          console.warn("login fail", error);
        },
      });
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

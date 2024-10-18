import {Component, OnInit} from '@angular/core';
import {AuthService, AuthToken} from "../../services/auth.service";
import {AuthDto} from "../../models/auth-dto";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {SharedService} from "../../services/shared.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {LocalStorageService} from "../../services/local-storage.service";
import {finalize} from "rxjs";
import * as fontAwesomeIcons from '@fortawesome/free-solid-svg-icons';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  icons = fontAwesomeIcons;
  loginUser: AuthDto;
  email: UntypedFormControl;
  password: UntypedFormControl;
  loginForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.loginUser = new AuthDto('', '', '', '');

    this.email = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
    ]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
      console.log('API URL:', environment.apiUrl);
  }

  ngOnInit(): void {}

  login(): void {
    let responseOK: boolean = false;
    let errorResponse: any;

    this.loginUser.email = this.email.value;
    this.loginUser.repassword = this.password.value;

    this.authService
      .login(this.loginUser)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'loginFeedback',
            responseOK,
            errorResponse
          );

          if (responseOK) {
            this.authService.setMasterPassword(this.loginUser.repassword);
            this.router.navigateByUrl('credential-list');
          }
        })
      )
      .subscribe(
        (resp: AuthToken) => {
          responseOK = true;
          this.loginUser.id = resp.id;
          this.loginUser.token = resp.token;

          this.localStorageService.set('id',this.loginUser.id);
          this.localStorageService.set('email',this.loginUser.email);
          this.localStorageService.set('token',this.loginUser.token);
        },
        (error: HttpErrorResponse) => {
          responseOK = false;
          errorResponse = error.error;

          this.sharedService.errorLog(error.error);
        }
      );
  }
}

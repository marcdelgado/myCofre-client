import {Component, OnInit} from '@angular/core';
import {AuthDto} from "../../models/auth-dto";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {LocalStorageService} from "../../../../temp/local-storage.service";
import {finalize} from "rxjs";
import * as fontAwesomeIcons from '@fortawesome/free-solid-svg-icons';
import {environment} from "../../../environments/environment";
import {AuthService} from "../../services/auth.service";
import {SharedService} from "../../services/shared.service";

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

  onLogin(): void {
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
            this.router.navigateByUrl('credential-list');
          }
        })
      )
      .subscribe(
        () => {
          responseOK = true;
        },
        (error: HttpErrorResponse) => {
          responseOK = false;
          if(error.error) this.sharedService.printResponseError(error.error);
          else this.sharedService.printErrorMessage(error);
        }
      );
  }
}

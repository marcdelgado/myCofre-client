import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {LocalStorageService} from "../../../../temp/local-storage.service";
import {finalize, switchMap} from "rxjs";
import * as fontAwesomeIcons from '@fortawesome/free-solid-svg-icons';
import {environment} from "../../../environments/environment";
import {AuthService} from "../../services/auth.service";
import {SharedService} from "../../services/shared.service";
import {LoginForm} from "../../models/forms/login-form";
import {VaultService} from "../../services/vault.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  icons = fontAwesomeIcons;
  loginForm: UntypedFormGroup;

  constructor(
      private formBuilder: UntypedFormBuilder,
      private authService: AuthService,
      private sharedService: SharedService,
      private router: Router,
      private vaultService: VaultService
  ) {
    //Declaración del formulario y restricciones
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(64)
      ]]
    });
  }

  ngOnInit(): void {}

  onLogin(): void {
    let responseOK: boolean = false;
    let errorResponse: any;

    const loginForm: LoginForm = new LoginForm(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value);

    //Llamada al servicio de Login
    this.authService.login(loginForm).pipe(
        switchMap(() => {
          responseOK = true;
          //Llamada encadenada al servicio de inicialización del vault
          return this.vaultService.init(loginForm.password);
        }),
        finalize(async () => {
          await this.sharedService.managementToast('loginFeedback', responseOK, errorResponse);
          if (responseOK) {
            this.router.navigateByUrl('home');
          }
        })
      )
      .subscribe(
        () => {
          console.log('VaultService inicializado correctamente.');
        },
        (error: HttpErrorResponse) => {
          responseOK = false;
          if (error.error) {
            this.sharedService.responseErrorLog(error.error);
          } else {
            this.sharedService.errorLog(error);
          }
        }
      );
  }
}

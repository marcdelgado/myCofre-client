import { Injectable } from '@angular/core';
import {catchError, map, Observable, tap, throwError} from "rxjs";
import {ApiService} from "./api.service";
import {LoginForm} from "../models/forms/login-form";
import {AuthLoginRequest} from "../models/api/auth-login-request";
import {AuthLoginResponse} from "../models/api/auth-login-response";
import {ApiErrorResponse} from "../models/api/api-error-response";
import {debugLog, SharedService} from "./shared.service";
import {setRepassword} from "./crypto.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    /*private sharedService: SharedService*/) {}


  public login(form: LoginForm): Observable<void> {
    const request = new AuthLoginRequest(form.email, setRepassword(form.password));
    //const request = new AuthLoginRequest(form.email, form.repassword);
    return this.apiService.postAuthLogin(request).pipe(
      tap((response) => {
        sessionStorage.setItem('password', form.password);
        sessionStorage.setItem('rePassword', setRepassword(form.password));
        sessionStorage.setItem('userToken', (response as AuthLoginResponse).sessionToken);
      }),
      map(() => undefined),
      catchError((error) => {
        sessionStorage .removeItem('password');
        sessionStorage .removeItem('userToken');
        return throwError(() => error); // Propagamos el error sin procesar
      })
    );
  }

  public logout(): void {
    sessionStorage.removeItem('userToken');
  }

  public isAuthenticated(): boolean{
    const token = sessionStorage.getItem('userToken');
    return !!token;
  }

  private isAuthLoginResponse(response: AuthLoginResponse | ApiErrorResponse): response is AuthLoginResponse {
      return (response as AuthLoginResponse).sessionToken !== undefined;
  }

}




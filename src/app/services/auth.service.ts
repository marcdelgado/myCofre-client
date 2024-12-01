import { Injectable } from '@angular/core';
import {catchError, firstValueFrom, map, Observable, of, tap, throwError} from "rxjs";
import {ApiService} from "./api.service";
import {LoginForm} from "../models/forms/login-form";
import {AuthLoginRequest} from "../models/api/auth-login-request";
import {AuthLoginResponse} from "../models/api/auth-login-response";
import {ApiErrorResponse} from "../models/api/api-error-response";
import {debugLog, SharedService} from "./shared.service";
import * as CryptoJS from "./crypto.service";
import {Router} from "@angular/router";
import {ChangePasswordForm} from "../models/forms/change-password-form";
import {AuthChangeRepasswordRequest} from "../models/api/auth-change-repassword-request";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private router: Router) {}


  public login(form: LoginForm): Observable<void> {
    this.reset();
    this.setEmail(form.email);
    this.setPassword(form.password);
    this.setRepassword(CryptoJS.generateRepassword(form.password));
    const request = new AuthLoginRequest(form.email, this.getRepassword()||"");;
    return this.apiService.postAuthLogin(request).pipe(
      tap((response) => {
        this.setSessionToken((response as AuthLoginResponse).sessionToken)
        sessionStorage.setItem('password', form.password);
      }),
      map(() => undefined),
      catchError((error) => {
        this.reset();
        const errorMessage = `ERROR ${error.errorCode}:, ${error.description}`;
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  public logout(): void {
    this.reset();
  }


  changeRepassword(form: ChangePasswordForm): Observable<void> {
    try {
      const oldPassword = CryptoJS.generateRepassword(form.oldPassword);
      const newPassword = CryptoJS.generateRepassword(form.newPassword);
      const request = new AuthChangeRepasswordRequest(oldPassword, newPassword)

      return this.apiService.patchChangeRepassword(request).pipe(
          map((response) => {
            if (response) {
              throw new Error('La API devolvió un objeto inesperado en lugar de void.');
            }
          }),
          catchError((error) => {
            this.reset();
            const errorMessage = `ERROR ${error.errorCode}: ${error.description}`;
            console.error(errorMessage);
            return throwError(() => new Error(errorMessage));
          })
      );
    } catch (error) {
      console.error('Error durante el cambio de contraseña:', error);
      return throwError(() => new Error('Error interno al intentar cambiar la contraseña.'));
    }
  }


  //---------------------------------------------------------------------------
  // Getter/setter functions
  //---------------------------------------------------------------------------

  public getEmail(): string|null {
    return sessionStorage.getItem('authService__email');
  }

  public setEmail(email:string):void{
    sessionStorage.setItem('authService__email',email);
  }

  public getPassword(): string|null {
    return sessionStorage.getItem('authService__password');
  }

  public setPassword(email:string):void{
    sessionStorage.setItem('authService__password',email);
  }

  public getRepassword(): string|null {
    return sessionStorage.getItem('authService__repassword');
  }

  public setRepassword(email:string):void{
    sessionStorage.setItem('authService__repassword',email);
  }

  public getSessionToken(): string|null {
    return sessionStorage.getItem('authService__sessionToken');
  }

  public setSessionToken(email:string):void{
    sessionStorage.setItem('authService__sessionToken',email);
  }

  public reset():void{
    sessionStorage.removeItem('authService__email');
    sessionStorage.removeItem('authService__password');
    sessionStorage.removeItem('authService__repassword');
    sessionStorage.removeItem('authService__sessionToken');
  }



  public isAuthenticated(): Observable<boolean> {
    if (this.getSessionToken()) {
      return this.apiService.getUserView().pipe(
        map(() => true), // Si la llamada tiene éxito, el token es válido
        catchError((error:ApiErrorResponse) => {
          this.reset();
          if(error.errorCode === '403'){
            return of(false); // Devuelve false en caso de error
          }else{
            const errorMessage = `ERROR ${error.errorCode}:, ${error.description}`;
            console.error(errorMessage);
            return of(false);
          }
        })
      );
    }else{
      return of(false);
    }
  }

  public ensureAuthentication(): Observable<void> {
    if (this.getSessionToken()) {
      return this.apiService.getUserView().pipe(
        map(() => undefined), // Si la llamada tiene éxito, devuelve vacío
        catchError((error: ApiErrorResponse) => {
          this.reset(); // Resetea el estado si ocurre un error
          if (error.errorCode === '403') {
            // Error específico de autenticación
            return throwError(() => new Error('ERROR 403: Authentication failed: Invalid session token.'));
          } else {
            // Otros errores
            const errorMessage = `ERROR ${error.errorCode}: ${error.description}`;
            console.error(errorMessage);
            return throwError(() => new Error(errorMessage));
          }
        })
      );
    } else {
      // Si no hay token, lanza un error inmediatamente
      return throwError(() => new Error('ERROR 403: Authentication failed: No session token.'));
    }
  }

  private isAuthLoginResponse(response: AuthLoginResponse | ApiErrorResponse): response is AuthLoginResponse {
      return (response as AuthLoginResponse).sessionToken !== undefined;
  }

  /*
  public checkAuthenticated(): Observable<boolean> {
    return this.isAuthenticated().pipe(
      tap(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
*/
}




import { Injectable } from '@angular/core';
import {ApiErrorResponse} from "../models/api/api-error-response";
import {catchError, map, Observable, tap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {VaultReadResponse} from "../models/api/vault-read-response";
import {UserSignupRequest} from "../models/api/user-signup-request";
import {UserRequestDeleteRequest} from "../models/api/user-request-delete-request";
import {UserEditRequest} from "../models/api/user-edit-request";
import {UserConfirmDeleteRequest} from "../models/api/user-confirm-delete-request";
import {UserActivateRequest} from "../models/api/user-activate-request";
import {UserViewResponse} from "../models/api/user-view-response";
import {AuthLoginRequest} from "../models/api/auth-login-request";
import {AuthLoginResponse} from "../models/api/auth-login-response";
import {AuthChangeRepasswordRequest} from "../models/api/auth-change-repassword-request";
import {AuthGetLoginAttemptsResponse} from "../models/api/auth-get-login-attempts-response";
import {debugLog} from "./shared.service";
import {VaultWriteRequest} from "../models/api/vault-write-request";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    // VAULT ENDPOINTS
    // --------------------------------------------------------------------------

    putVaultWrite(vaultData: VaultWriteRequest): Observable<void | ApiErrorResponse | HttpErrorResponse> {
        const url = `${environment.apiUrl}/vault/write`;
        return this.http.put<void>(url, vaultData, { headers: this.getHeaders() }).pipe(
            catchError((error) => {
              return throwError(() => this.extractApiErrorResponse(error));
            })
        );
    }

    getVaultRead(): Observable<VaultReadResponse | ApiErrorResponse | HttpErrorResponse> {
        const url = `${environment.apiUrl}/vault/read`;
        return this.http.get<VaultReadResponse>(url, { headers: this.getHeaders() }).pipe(
            catchError((error) => {
              return throwError(() => this.extractApiErrorResponse(error));
            })
        );
    }




    //USER ENDPOINTS
    // --------------------------------------------------------------------------

    putUserSignup(signupData: UserSignupRequest): Observable<void | ApiErrorResponse | HttpErrorResponse> {
        const url = `${environment.apiUrl}/user/signup`;
        return this.http.put<void>(url, signupData).pipe(
            tap((response)=>{
                console.log("hola");
            }),
            catchError((error) => {
              return throwError(() => this.extractApiErrorResponse(error));
            })
        );
    }

    patchUserRequestDelete(requestData: UserRequestDeleteRequest): Observable<void | ApiErrorResponse | HttpErrorResponse> {
        const url = `${environment.apiUrl}/user/requestDelete`;
        return this.http.patch<void>(url, requestData).pipe(
            catchError((error) => {
              return throwError(() => this.extractApiErrorResponse(error));
            })
        );
    }

    patchUserEdit(editData: UserEditRequest): Observable<void | ApiErrorResponse | HttpErrorResponse> {
        const url = `${environment.apiUrl}/user/edit`;
        return this.http.patch<void>(url, editData, {headers: this.getHeaders()}).pipe(
            tap(() => console.log('Solicitud exitosa: Datos enviados correctamente.')), // Log en caso de éxito
            catchError((error) => {
              return throwError(() => this.extractApiErrorResponse(error));
            })
        );
    }

    patchUserConfirmDelete(confirmData: UserConfirmDeleteRequest): Observable<void | ApiErrorResponse | HttpErrorResponse> {
        const url = `${environment.apiUrl}/user/confirmDelete`;
        return this.http.patch<void>(url, confirmData, {headers: this.getHeaders()}).pipe(
            catchError((error) => {
              return throwError(() => this.extractApiErrorResponse(error));
            })
        );
    }

    patchUserActivate(activateData: UserActivateRequest): Observable<void | ApiErrorResponse | HttpErrorResponse> {
        const url = `${environment.apiUrl}/user/activate`;
        return this.http.patch<void>(url, activateData).pipe(
            catchError((error) => {
              return throwError(() => this.extractApiErrorResponse(error));
            })
        );
    }

    getUserView(): Observable<UserViewResponse | ApiErrorResponse> {
        const url = `${environment.apiUrl}/user/view`;
        return this.http.get<UserViewResponse>(url, {headers: this.getHeaders()}).pipe(
            catchError((error) => {
              return throwError(() => this.extractApiErrorResponse(error));
            })
        );
    }

    //AUTH ENDPOINTS
    // --------------------------------------------------------------------------
    postAuthLogin(loginData: AuthLoginRequest): Observable<AuthLoginResponse | ApiErrorResponse | HttpErrorResponse> {
        const url = `${environment.apiUrl}/auth/login`;
        return this.http.post<AuthLoginResponse>(url, loginData).pipe(
            tap((response: AuthLoginResponse) => {
              this.setSessionToken(response.sessionToken!);
            }),catchError((error) => {
              return throwError(() => this.extractApiErrorResponse(error));
            })
        );
    }

    patchChangeRepassword(repasswordData: AuthChangeRepasswordRequest): Observable<void | ApiErrorResponse | HttpErrorResponse> {
        const url = `${environment.apiUrl}/auth/changeRepassword`;
        return this.http.patch<void | ApiErrorResponse>(url, repasswordData, { headers: this.getHeaders() }).pipe(
            tap((response)=>{
                console.log("hola");
            }),
            catchError((error) => {
              return throwError(() => this.extractApiErrorResponse(error));
            })
        );
    }

    getAuthGetLoginAttempts(): Observable<AuthGetLoginAttemptsResponse | ApiErrorResponse | HttpErrorResponse> {
        const url = `${environment.apiUrl}/auth/getLoginAttempts`;
        return this.http.get<AuthGetLoginAttemptsResponse>(url, {headers: this.getHeaders()}).pipe(
            catchError((error) => {
              return throwError(() => this.extractApiErrorResponse(error));
            })
        );
    }

    // Aux functions
    // --------------------------------------------------------------------------
  private extractApiErrorResponse(error: HttpErrorResponse): ApiErrorResponse | HttpErrorResponse {
    if (error.error && typeof error.error === 'object' && 'status' in error.error && 'message' in error.error) {
      return new ApiErrorResponse({
        status: error.error.status,
        message: error.error.message,
        error: error.error.error || 'Unknown Error',
        path: error.error.path || error.url || 'Unknown',
        errors: error.error.errors || []
      });
    }else{
      return error;
    }
  }

    private getHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        if (this.getSessionToken()) {
            headers = headers.set('Authorization', `Bearer ${this.getSessionToken()}`);
        }
        return headers;
    }

  private setSessionToken(token:string):void {
    sessionStorage.setItem("apiService__sessionToken", token);
  }

  private getSessionToken():string {
    return sessionStorage.getItem("apiService__sessionToken")||"";
  }

}

import { Injectable } from '@angular/core';
import {ApiErrorResponse} from "../models/api/api-error-response";
import {catchError, map, Observable, tap, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
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

    putVaultWrite(vaultData: VaultWriteRequest): Observable<void | ApiErrorResponse> {
        const url = `${environment.apiUrl}/vault/write`;
        return this.http.put<void>(url, vaultData, { headers: this.getHeaders() }).pipe(
            catchError((error) => {
                const apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    getVaultRead(): Observable<VaultReadResponse | ApiErrorResponse> {
        const url = `${environment.apiUrl}/vault/read`;
        return this.http.get<VaultReadResponse>(url, { headers: this.getHeaders() }).pipe(
            catchError((error) => {
                const apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }




    //USER ENDPOINTS
    // --------------------------------------------------------------------------

    putUserSignup(signupData: UserSignupRequest): Observable<void | ApiErrorResponse> {
        const url = `${environment.apiUrl}/user/signup`;
        return this.http.put<void>(url, signupData).pipe(
            tap((response)=>{
                console.log("hola");
            }),
            catchError((error) => {
                let apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    patchUserRequestDelete(requestData: UserRequestDeleteRequest): Observable<void | ApiErrorResponse> {
        const url = `${environment.apiUrl}/user/requestDelete`;
        return this.http.patch<void>(url, requestData).pipe(
            catchError((error) => {
                let apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    patchUserEdit(editData: UserEditRequest): Observable<void | ApiErrorResponse> {
        const url = `${environment.apiUrl}/user/edit`;
        return this.http.patch<void>(url, editData, {headers: this.getHeaders()}).pipe(
            tap(() => console.log('Solicitud exitosa: Datos enviados correctamente.')), // Log en caso de éxito
            catchError((error) => {
                let apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    patchUserConfirmDelete(confirmData: UserConfirmDeleteRequest): Observable<void | ApiErrorResponse> {
        const url = `${environment.apiUrl}/user/confirmDelete`;
        return this.http.patch<void>(url, confirmData, {headers: this.getHeaders()}).pipe(
            catchError((error) => {
                let apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    patchUserActivate(activateData: UserActivateRequest): Observable<void | ApiErrorResponse> {
        const url = `${environment.apiUrl}/user/activate`;
        return this.http.patch<void>(url, activateData).pipe(
            catchError((error) => {
                let apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    getUserView(): Observable<UserViewResponse | ApiErrorResponse> {
        const url = `${environment.apiUrl}/user/view`;
        return this.http.get<UserViewResponse>(url, {headers: this.getHeaders()}).pipe(
            catchError((error) => {
                let apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    //AUTH ENDPOINTS
    // --------------------------------------------------------------------------
    postAuthLogin(loginData: AuthLoginRequest): Observable<AuthLoginResponse | ApiErrorResponse> {
        const url = `${environment.apiUrl}/auth/login`;
        return this.http.post<AuthLoginResponse>(url, loginData).pipe(
            tap((response: AuthLoginResponse) => {
              this.setSessionToken(response.sessionToken!);
            }),catchError((error) => {
                let apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    patchChangeRepassword(repasswordData: AuthChangeRepasswordRequest): Observable<void | ApiErrorResponse> {
        const url = `${environment.apiUrl}/auth/changeRepassword`;
        return this.http.patch<void | ApiErrorResponse>(url, repasswordData, { headers: this.getHeaders() }).pipe(
            tap((response)=>{
                console.log("hola");
            }),
            catchError((error) => {
                console.error('Error en la API:', error);
                const apiError: ApiErrorResponse = {
                    errorCode: error.status || 'UNKNOWN',
                    description: error.message || 'Error desconocido en la API'
                };
                return throwError(() => apiError);
            })
        );
    }

    getAuthGetLoginAttempts(): Observable<AuthGetLoginAttemptsResponse | ApiErrorResponse> {
        const url = `${environment.apiUrl}/auth/getLoginAttempts`;
        return this.http.get<AuthGetLoginAttemptsResponse>(url, {headers: this.getHeaders()}).pipe(
            catchError((error) => {
                let apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    // Aux functions
    // --------------------------------------------------------------------------
    private generateApiError(error: any): ApiErrorResponse {
        let apiError: ApiErrorResponse;
        if (error.error && typeof error.error === 'object') {
            apiError = new ApiErrorResponse(error.error, "");
        } else {
            apiError = new ApiErrorResponse(
                error.status || 500,
                error.statusText || 'An error occurred'
            );
        }
        return apiError;
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

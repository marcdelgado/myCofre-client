import { Injectable } from '@angular/core';
import {ApiErrorResponse} from "../models/api/api-error-response";
import {catchError, Observable, tap, throwError} from "rxjs";
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

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    // VAULT ENDPOINTS
    // --------------------------------------------------------------------------

    putVaultWrite(vaultData: any): Observable<void | ApiErrorResponse> {
        const url = `${environment.apiUrl}/vault/write`;
        debugLog("token de trabajo:" + sessionStorage.getItem("sessionToken"));
        return this.http.put<void>(url, vaultData, { headers: this.getHeaders() }).pipe(
            catchError((error) => {
                const apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    getVaultRead(): Observable<VaultReadResponse | ApiErrorResponse> {
        const url = `${environment.apiUrl}/vault/read`;
        debugLog("token de trabajo:" + sessionStorage.getItem("sessionToken"));
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
            catchError((error) => {
                let apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    patchUserRequestDelete(requestData: UserRequestDeleteRequest): Observable<void | ApiErrorResponse> {
        const url = `${environment.apiUrl}/user/request-delete`;
        return this.http.patch<void>(url, requestData, {headers: this.getHeaders()}).pipe(
            catchError((error) => {
                let apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    patchUserEdit(editData: UserEditRequest): Observable<void | ApiErrorResponse> {
        const url = `${environment.apiUrl}/user/edit`;
        return this.http.patch<void>(url, editData, {headers: this.getHeaders()}).pipe(
            catchError((error) => {
                let apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    patchUserConfirmDelete(confirmData: UserConfirmDeleteRequest): Observable<void | ApiErrorResponse> {
        const url = `${environment.apiUrl}/user/confirm-delete`;
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
                sessionStorage.setItem("sessionToken", response.sessionToken!);
                debugLog("token devuelto:" + sessionStorage.getItem("sessionToken"));
            }),catchError((error) => {
                let apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    patchChangeRepassword(repasswordData: AuthChangeRepasswordRequest): Observable<void | ApiErrorResponse> {
        const url = `${environment.apiUrl}/auth/change-repassword`;
        return this.http.patch<void>(url, repasswordData, {headers: this.getHeaders()}).pipe(
            catchError((error) => {
                let apiError: ApiErrorResponse = this.generateApiError(error);
                return throwError(() => apiError);
            })
        );
    }

    getAuthGetLoginAttempts(): Observable<AuthGetLoginAttemptsResponse | ApiErrorResponse> {
        const url = `${environment.apiUrl}/auth/get-login-attempts`;
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
        if (sessionStorage.getItem("sessionToken")) {
            headers = headers.set('Authorization', `Bearer ${sessionStorage.getItem("sessionToken")}`);
        }
        return headers;
    }

}

import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {catchError, map, Observable, throwError} from "rxjs";
import {UserProfileForm} from "../models/forms/user-profile-form";
import {UserViewResponse} from "../models/api/user-view-response";
import {UserEditRequest} from "../models/api/user-edit-request";
import {UserSignupRequest} from "../models/api/user-signup-request";
import {SignupForm} from "../models/forms/signup-form";
import * as CryptoJS from "./crypto.service";
import {ApiErrorResponse} from "../models/api/api-error-response";
import {UserActivateRequest} from "../models/api/user-activate-request";
import {UserRequestDeleteRequest} from "../models/api/user-request-delete-request";
import {UserConfirmDeleteRequest} from "../models/api/user-confirm-delete-request";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUserProfile(): Observable<UserProfileForm> {
    return this.apiService.getUserView().pipe(
        map(response => {
          if (this.isUserViewResponse(response)) {
            return new UserProfileForm(response.name, response.surname, response.email);
          } else {
            throw new Error('La respuesta no tiene el formato esperado.');
          }
        }),
        catchError(error => {
          const errorMessage = `ERROR ${error.errorCode}: ${error.description}`;
          console.error(errorMessage);
          return throwError(() => new Error(errorMessage));
        })
    );
  }

  saveUserProfile(form: UserProfileForm): Observable<void> {
    const request = new UserEditRequest(form.name,form.surname, form.email);

    return this.apiService.patchUserEdit(request).pipe(
        map(response => {
          return;
        }),
        catchError(error => {
          const errorMessage = `ERROR ${error.errorCode}: ${error.description}`;
          console.error(errorMessage);
          return throwError(() => new Error(errorMessage));
        })
    );
  }

    signup(form: SignupForm): Observable<void> {
        const repassword = CryptoJS.generateRepassword(form.password)
        const request: UserSignupRequest = new UserSignupRequest(form.name, form.surname, form.email, repassword);
        return this.apiService.putUserSignup(request).pipe(
            map(response => {
                return;
            }),
            catchError((error: ApiErrorResponse) => {
                const errorMessage = `ERROR ${error.errorCode}: ${error.description}`;
                console.error(errorMessage);
                return throwError(() => new Error(errorMessage));            })
        );
    }

  activate(email: string, token: string): Observable<void> {
    const request: UserActivateRequest = new UserActivateRequest(email, token);

    return this.apiService.patchUserActivate(request).pipe(
      map(response => {
        return; // Emitimos un resultado vacío en caso de éxito
      }),
      catchError((error: ApiErrorResponse) => {
        const errorMessage = `ERROR ${error.errorCode}: ${error.description}`;
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage)); // Emitimos un error con un mensaje más comprensible
      })
    );
  }

  requestDelete(email: string): Observable<void> {
    const request: UserRequestDeleteRequest = new UserRequestDeleteRequest(email, "");

    return this.apiService.patchUserRequestDelete(request).pipe(
      map(response => {
        return; // Emitimos un resultado vacío en caso de éxito
      }),
      catchError((error: ApiErrorResponse) => {
        const errorMessage = `ERROR ${error.errorCode}: ${error.description}`;
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage)); // Emitimos un error con un mensaje más comprensible
      })
    );
  }

  delete(email: string, token: string): Observable<void> {
      const request: UserConfirmDeleteRequest = new UserRequestDeleteRequest(email, token);

    return this.apiService.patchUserConfirmDelete(request).pipe(
      map(response => {
        return; // Emitimos un resultado vacío en caso de éxito
      }),
      catchError((error: ApiErrorResponse) => {
        const errorMessage = `ERROR ${error.errorCode}: ${error.description}`;
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage)); // Emitimos un error con un mensaje más comprensible
      })
    );
  }

  private isUserViewResponse(obj: any): obj is { name: string; surname: string; email: string } {
    return obj && typeof obj.name === 'string' && typeof obj.surname === 'string' && typeof obj.email === 'string';
  }

  private isUserEditRequest(obj: any): obj is { name: string; surname: string; email: string } {
    return obj && typeof obj.name === 'string' && typeof obj.surname === 'string' && typeof obj.email === 'string';
  }
}

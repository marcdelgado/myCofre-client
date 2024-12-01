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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUserProfile(): Observable<UserProfileForm> {
    return this.apiService.getUserView().pipe(
        map(response => {
          if (this.isUserViewResponse(response)) {
            // Crear una instancia de UserProfileForm con los datos de la respuesta
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
    // Preparar el objeto request para el backend
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

  private isUserViewResponse(obj: any): obj is { name: string; surname: string; email: string } {
    return obj && typeof obj.name === 'string' && typeof obj.surname === 'string' && typeof obj.email === 'string';
  }

  private isUserEditRequest(obj: any): obj is { name: string; surname: string; email: string } {
    return obj && typeof obj.name === 'string' && typeof obj.surname === 'string' && typeof obj.email === 'string';
  }
}

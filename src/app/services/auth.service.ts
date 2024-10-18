import { Injectable } from '@angular/core';
import {AuthDto} from "../models/auth-dto";
import {catchError, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {SharedService} from "./shared.service";
import {environment} from "../../environments/environment.prod";

export interface AuthToken {
  id: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiServiceUrl: string;
  private controller: string;
  private action: string;

  private masterPasswordKey = 'masterPassword';

  constructor(private http: HttpClient, private sharedService: SharedService){
    this.controller = 'auth';
    this.action = 'login';
    this.apiServiceUrl = environment.apiUrl + "/" + this.controller + "/" + this.action;
  }

  setMasterPassword(password: string): void {
    sessionStorage.setItem(this.masterPasswordKey, password);
  }

  getMasterPassword(): string | null {
    return sessionStorage.getItem(this.masterPasswordKey);
  }

  clearMasterPassword(): void {
    sessionStorage.removeItem(this.masterPasswordKey);
  }

  login(auth: AuthDto): Observable<AuthToken> {
    return this.http
      .post<AuthToken>(this.apiServiceUrl, auth)
      .pipe(catchError(this.sharedService.handleError));
  }

  // Comprueba si el usuario está autenticado, por ejemplo, verificando un token en localStorage
  isAuthenticated(): boolean {
    return !!localStorage.getItem('userToken');
  }

  // Método para cerrar sesión si es necesario
  logout() {
    localStorage.removeItem('userToken');
  }
}

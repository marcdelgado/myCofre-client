import { Injectable } from '@angular/core';
import {AuthDto} from "../src/app/models/auth-dto";
import {catchError, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../src/environments/environment";
import {Router} from "@angular/router";
import { SharedService } from 'src/app/services/shared.service';

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

  constructor(private http: HttpClient, private sharedService: SharedService, private router: Router){
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

  logout(): void {
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('userToken');
  }
}

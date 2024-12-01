import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from "@angular/core";
import {catchError, map, Observable, of} from "rxjs";
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true; // Permite la navegación
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(() => {
        // En caso de error, redirige al login
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}

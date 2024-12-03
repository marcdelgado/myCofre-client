import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  private fromRouteKey = 'navigation.fromRoute';

  setFromRoute(route: string): void {
    sessionStorage.setItem(this.fromRouteKey, route);
  }

  getFromRoute(): string {
    return sessionStorage.getItem(this.fromRouteKey) || 'home';
  }

  clearFromRoute(): void {
    sessionStorage.removeItem(this.fromRouteKey);
  }
}

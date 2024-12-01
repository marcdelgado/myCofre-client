import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  private fromRouteKey = 'navigation.fromRoute';

  setFromRoute(route: string): void {
    sessionStorage.setItem(this.fromRouteKey, route); // Almacena en sessionStorage
  }

  getFromRoute(): string {
    return sessionStorage.getItem(this.fromRouteKey) || 'home'; // Valor por defecto
  }

  clearFromRoute(): void {
    sessionStorage.removeItem(this.fromRouteKey); // Limpia el estado si es necesario
  }
}

import {Component, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'myCofre-client';
  currentRoute: string = '';

  header_excludeRoutes = ['/login','/signup/'];

  footer_excludeRoutes = ['/login','/signup/'];

  constructor(private router: Router, private translate: TranslateService) {
    //Idiomas disponibles e idioma del navegador
    const supportedLanguages = ['en', 'es', 'ca'];
    const browserLang = navigator.language.split('-')[0] || 'en';
    console.log('Idioma del navegador detectado:', browserLang);
    //Idioma a usar e idioma por defecto
    const languageToUse = supportedLanguages.includes(browserLang) ? browserLang : 'en';
    this.translate.setDefaultLang(languageToUse);
    this.translate.use(languageToUse).subscribe(() => {
      console.log('Traducciones cargadas.');
    });
  }

  ngOnInit(): void {
    // Inicializar currentRoute con la ruta actual
    this.currentRoute = this.router.url;

    // Suscribirse a eventos de navegación para actualizar currentRoute
    this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event) => {
          const navEndEvent = event as NavigationEnd;
          this.currentRoute = navEndEvent.urlAfterRedirects;
        });

  }

  isHeaderExcluded(): boolean{
    return this.header_excludeRoutes.includes(this.currentRoute);
  }

  isFooterExcluded(): boolean{
    return this.footer_excludeRoutes.includes(this.currentRoute);
  }
}

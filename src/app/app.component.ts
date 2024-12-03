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

  header_excludeRoutes = ['/login','/signup','/request-delete','/delete','/activate'];

  footer_excludeRoutes = ['/login','/signup','/request-delete','/delete','/activate'];

  constructor(private router: Router, private translate: TranslateService) {
    const supportedLanguages = ['en', 'es', 'ca'];
    const browserLang = navigator.language.split('-')[0] || 'en';
    console.log('Idioma del navegador detectado:', browserLang);
    const languageToUse = supportedLanguages.includes(browserLang) ? browserLang : 'en';
    this.translate.setDefaultLang(languageToUse);
    this.translate.use(languageToUse).subscribe(() => {
      console.log('Traducciones cargadas.');
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEndEvent = event as NavigationEnd;
        this.currentRoute = navEndEvent.urlAfterRedirects;
      });
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;

    this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event) => {
          const navEndEvent = event as NavigationEnd;
          this.currentRoute = navEndEvent.urlAfterRedirects;
        });

  }

  isHeaderExcluded(): boolean {
    return this.header_excludeRoutes.some(
      route => this.currentRoute.includes(route));
  }

  isFooterExcluded(): boolean {
    return this.footer_excludeRoutes.some(
      route => this.currentRoute.includes(route));
  }
}

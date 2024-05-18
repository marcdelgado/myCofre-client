import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {faCoffee, faRing} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  selectedLanguage = 'es';

  //https://mugan86.medium.com/internacionalizaci%C3%B3n-en-un-proyecto-angular-ngx-translate-1-3-9331c7509d12
  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang(this.selectedLanguage);
    this.translateService.use(this.selectedLanguage);
  }

  selectLanguage(lang: string) {
    this.translateService.use(lang);
  }

  protected readonly faCoffee = faCoffee;
  protected readonly faRing = faRing;
}

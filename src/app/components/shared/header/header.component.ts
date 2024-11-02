import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {
  faCoffee,
  faRing,
  faAddressCard,
  faUser,
  faTags,
  faArrowRightFromBracket, faArrowsRotate, faLanguage, faGlobe, faPlus
} from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent  implements OnInit{
  selectedLanguage: string = 'es';
  currentLanguagePlaceholder: string = "Español";

  //https://mugan86.medium.com/internacionalizaci%C3%B3n-en-un-proyecto-angular-ngx-translate-1-3-9331c7509d12
  constructor(private translateService: TranslateService, public authService: AuthService, private router: Router) {
    this.translateService.setDefaultLang(this.selectedLanguage);
    this.translateService.use(this.selectedLanguage);
    this.currentLanguagePlaceholder = this.translateService.instant('HOME.SPANISH');
  }

  selectLanguage(lang: string) {
    this.translateService.use(lang);
    this.updatePlaceholder();
  }

  updatePlaceholder() {
    switch (this.selectedLanguage) {
      case 'es':
        this.currentLanguagePlaceholder = this.translateService.instant('HOME.SPANISH');
        break;
      case 'ca':
        this.currentLanguagePlaceholder = this.translateService.instant('HOME.CATALAN');
        break;
      case 'en':
        this.currentLanguagePlaceholder = this.translateService.instant('HOME.ENGLISH');
        break;
      default:
        this.currentLanguagePlaceholder = this.translateService.instant('HOME.ENGLISH');
        break;
    }

  }

  protected readonly faCoffee = faCoffee;
  protected readonly faRing = faRing;
  protected readonly faAddressCard = faAddressCard;
  protected readonly faUser = faUser;

  ngOnInit() {
    console.log('AppHeaderComponent initialized');
  }


  protected readonly faTags = faTags;
  protected readonly faArrowRightFromBracket = faArrowRightFromBracket;
  protected readonly faArrowsRotate = faArrowsRotate;
  protected readonly faGlobe = faGlobe;
  protected readonly faPlus = faPlus;

  deployHamburger(x: HTMLElement) {
    x.classList.toggle('deployed');
    const elementsToToggle = document.querySelectorAll('.sessionLanguageOptions, .functionMenu');
    elementsToToggle.forEach((element) => {
      element.classList.toggle('deployed');
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

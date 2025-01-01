import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {
  faCoffee,
  faRing,
  faAddressCard,
  faUser,
  faTags,
  faArrowRightFromBracket, faArrowsRotate, faLanguage, faGlobe, faPlus, faHouse
} from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {VaultService} from "../../../services/vault.service";
import {NavigationStateService} from "../../../services/navigation-state.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent  implements OnInit{
  selectedLanguage: string = 'es';
  currentLanguagePlaceholder: string = "Español";
  currentView :string = "/home";

  //https://mugan86.medium.com/internacionalizaci%C3%B3n-en-un-proyecto-angular-ngx-translate-1-3-9331c7509d12
  constructor(private translateService: TranslateService,
              public authService: AuthService,
              private router: Router,
              private vaultService: VaultService,
              private navigationStateService: NavigationStateService) {
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

  syncVault(): void {
    this.vaultService.sync().subscribe({
      next: () => {
        console.log('Vault sincronizado correctamente.');
        alert('Sincronización completada.');
      },
      error: (err) => {
        console.error('Error al sincronizar el vault:', err);
        alert('Error durante la sincronización.');
      }
    });
  }

  addCredential() {
    // Configura la ruta de origen
    this.navigationStateService.setFromRoute(this.currentView);

    // Navega al formulario para crear una nueva categorías
    this.router.navigate(['/credential-detail'], {
      queryParams: { action: 'new' },
    });
  }

  protected readonly faHouse = faHouse;
}

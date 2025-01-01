import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CredentialListComponent} from "../credential-list/credential-list.component";
import {CategoryListComponent} from "../category-list/category-list.component";
import Split from 'split.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild(CategoryListComponent) categoryListComponent!: CategoryListComponent;
  @ViewChild(CredentialListComponent) credentialListComponent!: CredentialListComponent;

  handleCategoryFilter(selectedCategoryIds: string[]): void {
    if (this.credentialListComponent) {
      console.log(selectedCategoryIds);
      this.credentialListComponent.filter(selectedCategoryIds);
    }
  }

  handleSearch(keyword: string): void {
    if (this.credentialListComponent) {
      this.credentialListComponent.filterByWord(keyword);
    }
  }

  ngAfterViewInit(): void {
    // Inicializar Split.js cuando el DOM del componente esté listo
    this.initializeSplit();
  }

  initializeSplit(): void {
    Split(['.top-pane', '.bottom-pane'], {
      direction: 'vertical', // División vertical
      gutterSize: 24, // Tamaño del divisor
      minSize: 50, // Tamaño mínimo de cada panel
      sizes: [25, 75],
      cursor: 'row-resize' // Icono del cursor para dividir
    });
  }
}

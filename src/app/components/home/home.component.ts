import {Component, ViewChild} from '@angular/core';
import {CredentialListComponent} from "../credential-list/credential-list.component";
import {CategoryListComponent} from "../category-list/category-list.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild(CategoryListComponent) categoryListComponent!: CategoryListComponent;
  @ViewChild(CredentialListComponent) credentialListComponent!: CredentialListComponent;

  handleCategoryFilter(selectedCategoryIds: string[]): void {
    if (this.credentialListComponent) {
      console.log(selectedCategoryIds);
      this.credentialListComponent.filter(selectedCategoryIds); // Llama al filtro del CredentialListComponent
    }
  }

  handleSearch(keyword: string): void {
    if (this.credentialListComponent) {
      this.credentialListComponent.filterByWord(keyword);
    }
  }
}

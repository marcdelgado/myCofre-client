import { Component } from '@angular/core';
import { SyncService } from '../sync.service';
import { UserDataService } from '../vault.service';
import { CredentialDto } from '../../src/app/models/credential-dto';
import { CategoryDto } from '../../src/app/models/category-dto';
import { RelCredentialCategoryDto  } from '../../src/app/models/rel-credential-category-dto';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html'
})
export class SyncComponent {
  constructor(private syncService: SyncService, private userDataService: UserDataService) {}

  syncData(): void {
    const userData: {
      credentials: CredentialDto[];
      categories: CategoryDto[];
      relCredentialCategory: RelCredentialCategoryDto[];
    } = this.userDataService.getUserData();
    this.syncService.syncUserData(userData);
  }

  retrieveData(): void {
    this.syncService.retrieveUserData();
  }
}

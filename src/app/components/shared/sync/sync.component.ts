import { Component } from '@angular/core';
import { SyncService } from '../../../services/sync.service';
import { UserDataService } from '../../../services/user-data.service';
import { CredentialDto } from '../../../models/credential-dto';
import { CategoryDto } from '../../../models/category-dto';
import { RelCredentialCategoryDto  } from '../../../models/rel-credential-category-dto';

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

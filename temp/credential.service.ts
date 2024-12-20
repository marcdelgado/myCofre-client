import { Injectable } from '@angular/core';
import { UserDataService } from './vault.service';
import { CredentialDto } from '../src/app/models/credential-dto';
import { CategoryDto } from '../src/app/models/category-dto';
import { RelCredentialCategoryDto  } from '../src/app/models/rel-credential-category-dto';

@Injectable({
  providedIn: 'root'
})
export class CredentialService {
  constructor(private userDataService: UserDataService) {}

  getAllCredentials(): CredentialDto[] {
    return this.userDataService.getUserData().credentials;
  }

  getCredentialById(id: number): CredentialDto | undefined {
    return this.getAllCredentials().find(cred => cred.id === id);
  }

  addCredential(credential: CredentialDto): void {
    this.userDataService.addCredential(credential);
  }

  getCategoriesByCredentialId(credentialId: number): CategoryDto[] {
    const relations = this.userDataService.getUserData().relCredentialCategory;
    const categoryIds = relations.filter(rel => rel.credentialId === credentialId).map(rel => rel.categoryId);
    return this.userDataService.getUserData().categories.filter(cat => categoryIds.includes(cat.id));
  }
}

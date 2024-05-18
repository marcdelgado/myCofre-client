import { Injectable } from '@angular/core';
import { UserDataService } from './user-data.service';
import { CredentialDto } from '../models/credential-dto';
import { CategoryDto } from '../models/category-dto';
import { RelCredentialCategoryDto  } from '../models/rel-credential-category-dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private userDataService: UserDataService) {}

  getAllCategories(): CategoryDto[] {
    return this.userDataService.getUserData().categories;
  }

  getCategoryById(id: number): CategoryDto | undefined {
    return this.getAllCategories().find(cat => cat.id === id);
  }

  addCategory(category: CategoryDto): void {
    this.userDataService.addCategory(category);
  }

  getCredentialsByCategoryId(categoryId: number): CredentialDto[] {
    const relations = this.userDataService.getUserData().relCredentialCategory;
    const credentialIds = relations.filter(rel => rel.categoryId === categoryId).map(rel => rel.credentialId);
    return this.userDataService.getUserData().credentials.filter(cred => credentialIds.includes(cred.id));
  }
}

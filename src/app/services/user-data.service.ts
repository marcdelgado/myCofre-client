import { Injectable } from '@angular/core';
import { CredentialDto } from '../models/credential-dto';
import { CategoryDto } from '../models/category-dto';
import { RelCredentialCategoryDto  } from '../models/rel-credential-category-dto';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userData: {
    credentials: CredentialDto[];
    categories: CategoryDto[];
    relCredentialCategory: RelCredentialCategoryDto[];
  } = {
    credentials: [],
    categories: [],
    relCredentialCategory: []
  };

  constructor() {}

  setUserData(data: {
    credentials: CredentialDto[];
    categories: CategoryDto[];
    relCredentialCategory: RelCredentialCategoryDto[];
  }): void {
    this.userData = data;
  }

  getUserData(): {
    credentials: CredentialDto[];
    categories: CategoryDto[];
    relCredentialCategory: RelCredentialCategoryDto[];
  } {
    return this.userData;
  }

  addCredential(credential: CredentialDto): void {
    this.userData.credentials.push(credential);
  }

  addCategory(category: CategoryDto): void {
    this.userData.categories.push(category);
  }

  addRelCredentialCategory(rel: RelCredentialCategoryDto): void {
    this.userData.relCredentialCategory.push(rel);
  }
}

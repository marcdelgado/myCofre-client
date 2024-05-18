export class RelCredentialCategoryDto {
  credentialId: number;
  categoryId: number;

  constructor(credentialId: number, categoryId: number) {
    this.credentialId = credentialId;
    this.categoryId = categoryId;
  }
}

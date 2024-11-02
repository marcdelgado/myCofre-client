import { CategoryDto } from "./category-dto";
import { CredentialDto } from "./credential-dto";
import { v4 as uuidv4 } from 'uuid';
import { Type, Expose } from 'class-transformer';

export class VaultDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => CategoryDto)
  categories: CategoryDto[] = [];

  @Expose()
  @Type(() => CredentialDto)
  credentials: CredentialDto[] = [];

  constructor(
      name: string,
      categories: CategoryDto[] = [],
      credentials: CredentialDto[] = [],
      id?: string
  ) {
    this.name = name;
    this.categories = categories.map(category => new CategoryDto(category.name, [], category.id));
    this.credentials = credentials.map(credential => new CredentialDto(credential.serviceName, credential.serviceUrl, credential.username, credential.password, [], credential.id));
    this.id = id || uuidv4();
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      categories: this.categories.map(category => category.toJSON()),
      credentials: this.credentials.map(credential => credential.toJSON())
    };
  }
}

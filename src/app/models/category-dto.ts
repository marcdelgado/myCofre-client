import { CredentialDto } from "./credential-dto";
import { v4 as uuidv4 } from 'uuid';
import { Type, Expose } from 'class-transformer';

export class CategoryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => CredentialDto)
  credentials: CredentialDto[] = [];

  constructor(
      name: string,
      credentials: CredentialDto[] = [],
      id?: string
  ) {
    this.name = name;
    this.credentials = credentials;
    this.id = id || uuidv4();
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      credentials: this.credentials.map(credential => credential.id),
    };
  }
}

import { CategoryDto } from "./category-dto";
import { v4 as uuidv4 } from 'uuid';
import { Type, Expose } from 'class-transformer';

export class CredentialDto {
  @Expose()
  serviceName: string;

  @Expose()
  serviceUrl: string;

  @Expose()
  username: string;

  @Expose()
  password: string;

  @Expose()
  categories: string[] = [];

  @Expose()
  id: string;

  constructor(
      serviceName: string,
      serviceUrl: string,
      username: string,
      password: string,
      categories: string[] = [],
      id?: string
  ) {
    this.serviceName = serviceName;
    this.serviceUrl = serviceUrl;
    this.username = username;
    this.password = password;
    this.categories = categories;
    this.id = id || uuidv4();
  }

  public toJSON() {
    return {
      serviceName: this.serviceName,
      serviceUrl: this.serviceUrl,
      username: this.username,
      password: this.password,
      categories: this.categories,
      id: this.id
    };
  }
}

import {ApiMessage} from "./api-message";


export class UserViewResponse{

  name: string;
  surname: string;
  email: string;

  constructor(name: string, surname: string, email: string) {
    this.name = name;
    this.surname = surname;
    this.email = email;
  }
}

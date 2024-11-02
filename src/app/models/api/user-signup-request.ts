import {ApiMessage} from "./api-message";


export class UserSignupRequest{

  name: string;
  surname: string;
  email: string;
  repassword: string;

  constructor(name: string, surname: string, email: string, repassword: string) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.repassword = repassword;
  }
}

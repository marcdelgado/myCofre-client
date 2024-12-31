import {ApiMessage} from "./api-message";


export class UserSignupRequest{

  name: string;
  surname: string;
  email: string;
  repassword: string;
  language: string;

  constructor(name: string, surname: string, email: string, repassword: string, language: string) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.repassword = repassword;
    this.language = language;
  }
}

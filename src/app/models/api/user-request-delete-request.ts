import {ApiMessage} from "./api-message";


export class UserRequestDeleteRequest{

  email: string;
  language: string;

  constructor(email: string, language: string) {
    this.email = email;
    this.language = language;
  }
}

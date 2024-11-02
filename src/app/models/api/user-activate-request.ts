import {ApiMessage} from "./api-message";


export class UserActivateRequest{

  public email: string;
  public activationToken: string;

  constructor(email: string, activationToken: string) {
    this.email = email;
    this.activationToken = activationToken;
  }
}

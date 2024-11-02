import {ApiMessage} from "./api-message";


export class UserConfirmDeleteRequest{

  public email: string;
  public deleteToken: string;

  constructor(email: string, deleteToken: string) {
    this.email = email;
    this.deleteToken = deleteToken;
  }
}

import {ApiMessage} from "./api-message";


export class AuthChangeRepasswordRequest{

  public oldRepassword: string;
  public newRepassword: string;

  constructor(oldRepassword: string, newRepassword: string) {
    this.oldRepassword = oldRepassword;
    this.newRepassword = newRepassword;
  }
}

export class AuthLoginRequest{

  public email: string;
  public repassword: string;

  constructor(email: string, repassword: string) {
    this.email = email;
    this.repassword = repassword;
  }

}

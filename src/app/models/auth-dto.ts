export class AuthDto {
  id: string;
  token: string;
  email: string;
  repassword: string;

  constructor(
    id: string,
    token: string,
    email: string,
    repassword: string
  ) {
    this.id = id;
    this.token = token;
    this.email = email;
    this.repassword = repassword;
  }
}

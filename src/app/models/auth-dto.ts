export class AuthDto {
  id: string;
  token: string;
  email: string;
  password: string;

  constructor(
    id: string,
    token: string,
    email: string,
    password: string
  ) {
    this.id = id;
    this.token = token;
    this.email = email;
    this.password = password;
  }
}

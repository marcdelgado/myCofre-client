export class AuthLoginResponse {

  sessionToken: string;

  constructor(sessionToken: string) {
    this.sessionToken = sessionToken;
  }
}

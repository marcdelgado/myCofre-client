export class UserDeleteRequest {

  email: string;
  deleteToken: string;

  constructor(email: string, deleteToken: string) {
    this.email = email;
    this.deleteToken = deleteToken;
  }
}


export class AuthGetLoginAttemptsResponse{

  public createdAt: string;
  public success: boolean;

  constructor(createdAt: string, success: boolean) {
    this.createdAt = createdAt;
    this.success = success;
  }
}

import {ApiMessage} from "./api-message";


export class ApiErrorResponse{

  public errorCode: string;
  public description: string;

  constructor(errorCode: string, description: string) {
    this.errorCode = errorCode;
    this.description = description;
  }

}

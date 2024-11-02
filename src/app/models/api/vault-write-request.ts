import {ApiMessage} from "./api-message";


export class VaultWriteRequest{

  public vaultContent: string;
  public lastUpdateTimestamp: string;

  constructor(vaultContent: string, lastUpdateTimestamp: string) {
    this.vaultContent = vaultContent;
    this.lastUpdateTimestamp = lastUpdateTimestamp;
  }
}

import {ApiMessage} from "./api-message";


export class VaultReadResponse{

  vaultContent: string;
  lastUpdateTimestamp: string;

  constructor(vaultContent: string, lastUpdateTimestamp: string) {
    this.vaultContent = vaultContent;
    this.lastUpdateTimestamp = lastUpdateTimestamp;
  }
}

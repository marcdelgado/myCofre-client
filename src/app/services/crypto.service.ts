import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  constructor() {}

  encrypt(data: any, password: string): string {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
    return ciphertext;
  }

  decrypt(ciphertext: string, password: string): any {
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }
}

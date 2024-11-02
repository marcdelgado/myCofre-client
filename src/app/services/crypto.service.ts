import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';



function encrypt(data: any, password: string): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
}

function decrypt(ciphertext: string, password: string): any {
  const bytes = CryptoJS.AES.decrypt(ciphertext, password);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

import * as CryptoJS from 'crypto-js';



export function encrypt(data: any, password: string): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
}

export function decrypt(ciphertext: string, password: string): any {
  const bytes = CryptoJS.AES.decrypt(ciphertext, password);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

export function setRepassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

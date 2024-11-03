import * as CryptoJS from 'crypto-js';



export function encrypt(data: any, password: string): string {
  const ciphertext:string = encodeBase64(data);
  return CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
}

export function decrypt(data: string, password: string): any {
  const ciphertext:string = decodeBase64(data);
  const bytes = CryptoJS.AES.decrypt(ciphertext, password);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

export function setRepassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

export function decodeBase64(data: string){
  return atob(data);
}

export function encodeBase64(data: string){
  return btoa(data);
}

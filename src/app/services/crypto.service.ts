import * as CryptoJS from 'crypto-js';



export function encrypt(data: any, password: string): string {
  if (data === "") return "";
  return CryptoJS.AES.encrypt(data, password).toString();
}

export function decrypt(data: string, password: string): any {
  if (data === "empty") return "";
  const bytes = CryptoJS.AES.decrypt(data, password);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted === "" ? null : decrypted;
}

export function generateRepassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

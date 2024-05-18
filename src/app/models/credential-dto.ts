export class CredentialDto {
  id: number;
  title: string;
  username?: string;
  secretKey?: string;
  notes?: string;

  constructor(
    id: number,
    title: string,
    username: string,
    secretKey: string,
    notes: string) {
    this.id = id;
    this.title = title;
    this.username = username;
    this.secretKey = secretKey;
    this.notes = notes;
  }
}

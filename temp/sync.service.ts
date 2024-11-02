import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { CryptoService } from '../src/app/services/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private syncUrl = 'https://example.com/sync'; // URL pendiente de definir

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cryptoService: CryptoService
  ) {}

  syncUserData(userData: any): void {
    const masterPassword = this.authService.getMasterPassword();
    if (!masterPassword) {
      throw new Error('Master password not set');
    }

    const encryptedData = this.cryptoService.encrypt(userData, masterPassword);

    this.http.post(this.syncUrl, { data: encryptedData }).subscribe(
      response => {
        console.log('Data synced successfully');
      },
      error => {
        console.error('Error syncing data', error);
      }
    );
  }

  retrieveUserData(): void {
    const masterPassword = this.authService.getMasterPassword();
    if (!masterPassword) {
      throw new Error('Master password not set');
    }

    this.http.get<{ data: string }>(this.syncUrl).subscribe(
      response => {
        const decryptedData = this.cryptoService.decrypt(response.data, masterPassword);
        console.log('Data retrieved and decrypted', decryptedData);
      },
      error => {
        console.error('Error retrieving data', error);
      }
    );
  }
}

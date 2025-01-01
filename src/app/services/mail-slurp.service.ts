import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MailSlurpService {
  private apiUrl = 'https://api.mailslurp.com';
  private apiInbox = '25c43018-484b-43bf-abe8-721eb2951315'; // Usa una variable de entorno para esta API KEY
  private apiMail = 'user-25c43018-484b-43bf-abe8-721eb2951315@mailslurp.biz'; // Usa una variable de entorno para esta API KEY
  private apiToken = '51cb566d1551dbdc4a57cb70cf88f89b622d2ffb57d41ea651701e7fabb9c808'; // Usa una variable de entorno para esta API KEY

  constructor(private http: HttpClient) {}

  checkEmailInbox(email: string): Observable<any> {
    const url = `${this.apiUrl}/inboxes/${email}/emails?apiKey=${this.apiToken}`;
    return this.http.get<any>(url);
  }

  getEmailContent(emailId: string): Observable<any> {
    const url = `${this.apiUrl}/emails/${emailId}?apiKey=${this.apiToken}`;
    return this.http.get<any>(url);
  }

  getLastEmail(): Observable<any> {
    const url = `${this.apiUrl}/inboxes/${this.apiInbox}/emails?apiKey=${this.apiToken}&limit=1`;
    return this.http.get<any>(url);
  }

  getLastEmailAboutSubject(subject: string | number | boolean): Observable<any> {
    const url = `${this.apiUrl}/inboxes/${this.apiInbox}/emails?apiKey=${this.apiToken}&subject=${encodeURIComponent(subject)}&limit=1`;
    return this.http.get<any>(url);
  }

  getLastEmailFromSender(sender: string | number | boolean): Observable<any> {
    const url = `${this.apiUrl}/inboxes/${this.apiInbox}/emails?apiKey=${this.apiToken}&from=${encodeURIComponent(sender)}&limit=1`;
    return this.http.get<any>(url);
  }
}

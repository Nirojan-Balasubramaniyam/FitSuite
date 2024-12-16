import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  alertsUrl: string =
    'https://gymfeemanagementsystem-appservice.azurewebsites.net/api';
  constructor(private http: HttpClient) {}

  addContactUsMessage(data: ContactUs) {
    return this.http.post(`${this.alertsUrl}/ContactUsMessage`, data);
  }

  getContactUsMessage(pageNumber: number, pageSize: number) {
    return this.http.get<any>(
      `${this.alertsUrl}/ContactUsMessage?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }
}

export interface ContactUs {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
}

export interface GetContactUs {
  messageId: number;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

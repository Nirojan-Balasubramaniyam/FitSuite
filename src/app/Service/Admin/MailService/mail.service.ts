import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SendMailRequest } from '../../../Models/sendMailRequest';

@Injectable({
  providedIn: 'root'
})
export class MailService {
   mailSendUrl = "https://localhost:7220/api/SendMail";

  constructor(private http: HttpClient) {}

  // Method to send email
  sendMail(sendMailRequest: SendMailRequest): Observable<any> {
    return this.http.post(`${this.mailSendUrl}/Send-Mail`, sendMailRequest);
  }

  sendMessageResponse(data:any){
    return this.http.post(`${this.mailSendUrl}/Send-Response`, data);
  }
}

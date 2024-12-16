import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert, AlertReq } from '../../../Models/overdueAlert';
import { PaymentSummary } from '../../../Models/paymentSummary';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // alertsUrl: string = "https://gymfeemanagementsystem-appservice.azurewebsites.net/api/Alert";
  alertsUrl: string = "https://gymfeemanagementsystem-appservice.azurewebsites.net/api/Alert";

  constructor(private http: HttpClient) {}

  getAlertsByType(alertType: string, branchId?: number): Observable<Alert[]> {
    let params = new HttpParams();
    
    if (branchId !== undefined && branchId !== null) {
      params = params.set('branchId', branchId.toString());
    }
  
    // Append alertType directly after 'alert-type'
    return this.http.get<Alert[]>(`${this.alertsUrl}/alert-type${alertType}`, { params });
  }

  getAlertsByMemberId(memberId: number): Observable<Alert[]> {
    let params = new HttpParams();
    
      params = params.set('memberId', memberId.toString());
    
    return this.http.get<Alert[]>(`${this.alertsUrl}/member-id${memberId}`);
  }

  updateAlert(alertId: number, alertReq: AlertReq): Observable<Alert> {
    return this.http.put<Alert>(`${this.alertsUrl}/${alertId}`, alertReq);
  }
}

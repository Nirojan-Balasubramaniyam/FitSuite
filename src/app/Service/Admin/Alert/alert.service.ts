import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert } from '../../../Models/overdueAlert';
import { PaymentSummary } from '../../../Models/paymentSummary';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alertsUrl: string = "https://localhost:7220/api/Alert";

  constructor(private http: HttpClient) {}

  getAlertsByType(alertType: string, branchId?: number): Observable<Alert[]> {
    let params = new HttpParams();
    
    if (branchId !== undefined && branchId !== null) {
      params = params.set('branchId', branchId.toString());
    }
  
    // Append alertType directly after 'alert-type'
    return this.http.get<Alert[]>(`${this.alertsUrl}/alert-type${alertType}`, { params });
  }
}

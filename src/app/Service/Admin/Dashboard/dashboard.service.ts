import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgramReport } from '../../../Models/programReport';
import { PaymentSummary } from '../../../Models/paymentSummary';
import { Alert } from '../../../Models/overdueAlert';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  dashboardUrl: string = "https://gymfeemanagementsystem-appservice.azurewebsites.net/api/Dashboard/payment-summary";
  alertsUrl: string = "https://gymfeemanagementsystem-appservice.azurewebsites.net/api/Alert";

  constructor(private http: HttpClient) {}

  getPaymentSummary(branchId: number): Observable<PaymentSummary> {
    let params = new HttpParams();
      params = params.set('branchId', branchId.toString());
    
  
    return this.http.get<PaymentSummary>(`${this.dashboardUrl}`, { params });
  }

  getAlertsByType(alertType: string, branchId?: number): Observable<Alert[]> {
    let params = new HttpParams().set('alertType', alertType);
    
    if (branchId !== undefined && branchId !== null) {
      params = params.set('branchId', branchId.toString());
    }

    return this.http.get<Alert[]>(`${this.alertsUrl}/alert-type`, { params });
  }
}

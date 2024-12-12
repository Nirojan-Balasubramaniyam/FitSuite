import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentReport } from '../../../Models/paymentReport';
import { ProgramReport } from '../../../Models/programReport';
import { MemberReport } from '../../../Models/memberReport';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  reportUrl: string = "https://localhost:7220/api/Report";

  constructor(private http: HttpClient) {}

  getPaymentReport(paymentType: string, branchId?: number, startDate?: Date, endDate?: Date): Observable<PaymentReport[]> {
    let params = new HttpParams();
  
    if (branchId !== undefined && branchId !== null) {
      params = params.set('branchId', branchId.toString());
    }
    if (paymentType) {
      params = params.set('paymentType', paymentType);
    }
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
  
    return this.http.get<PaymentReport[]>(`${this.reportUrl}/payment-report`, { params });
  }
  

  getOverdueReport(branchId?: number): Observable<PaymentReport[]> {
    let params = new HttpParams();
  
    if (branchId !== undefined && branchId !== null) {
      params = params.set('branchId', branchId.toString());
    }
  
    return this.http.get<PaymentReport[]>(`${this.reportUrl}/overdue-report`, { params });
  }
  

  getMemberReport(isActive: boolean, branchId: number = 0): Observable<MemberReport[]> {
    let params = new HttpParams()
      .set('isActive', isActive.toString())
      .set('branchId', branchId.toString());
  
    return this.http.get<MemberReport[]>(`${this.reportUrl}/member-report`, { params });
  }
  

  getProgramReport(branchId?: number): Observable<ProgramReport[]> {
    let params = new HttpParams();
  
    if (branchId !== undefined) {
      params = params.set('branchId', branchId.toString());
    }
  
    return this.http.get<ProgramReport[]>(`${this.reportUrl}/program-report`, { params });
  }
  
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment, PaymentReq } from '../../../Models/payment';
import { PaginationResponse } from '../../../Models/pagination';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentUrl = 'https://localhost:7220/api/Payment';  // Base URL for Payment API

  constructor(private http: HttpClient) {}

  
  getAllPaymentswithPagination(pageNumber: number, pageSize: number, paymentType: string): Observable<PaginationResponse<Payment>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('paymentType', paymentType);

    return this.http.get<PaginationResponse<Payment>>(this.paymentUrl, { params });
  }

  
  getPaymentById(paymentId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.paymentUrl}/${paymentId}`);
  }

  
  createPayment(newPayment: PaymentReq): Observable<Payment> {
    return this.http.post<Payment>(this.paymentUrl, newPayment);
  }

  
  updatePayment(paymentId: number, updatedPayment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.paymentUrl}/${paymentId}`, updatedPayment);
  }

 
  deletePayment(paymentId: number): Observable<void> {
    return this.http.delete<void>(`${this.paymentUrl}/${paymentId}`);
  }

  // Get last renewal payment for a member 
  getLastRenewalPaymentForMember(memberId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.paymentUrl}/last-renewal/${memberId}`);
  }

  // Get payments for a member 
  getPaymentsForMember(memberId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.paymentUrl}/member-payments/${memberId}`);
  }

  // Get all payments (custom endpoint)
  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.paymentUrl}/all-payments`);
  }
}

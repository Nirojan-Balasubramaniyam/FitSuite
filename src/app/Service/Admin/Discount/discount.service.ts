import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Discount, DiscountReq } from '../../../Models/discount';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private apiUrl = 'https://localhost:7220/api/Discount';

  constructor(private http: HttpClient) { }

  getAllDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getDiscountById(id: number): Observable<Discount> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Discount>(url).pipe(
      catchError(this.handleError)
    );
  }

  createDiscount(discount: DiscountReq): Observable<Discount> {
    return this.http.post<Discount>(this.apiUrl, discount).pipe(
      catchError(this.handleError)
    );
  }

  updateDiscount(id: number, discount: DiscountReq): Observable<Discount> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Discount>(url, discount).pipe(
      catchError(this.handleError)
    );
  }

  deleteDiscount(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Error:', error);
    return throwError('Something went wrong. Please try again later.');
  }
}

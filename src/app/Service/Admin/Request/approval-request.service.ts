import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../../../Models/pagination';
import { NewOrChangeMemberRequest } from '../../../Models/newOrChangeMemberRequest';
import { LeaveProgramRequest, LeaveProgramRequestDTO } from '../../../Models/leaveProgramRequest';
import { ProgramAddonRequest, ProgramAddonRequestDTO } from '../../../Models/programAddonRequest';
import { ApprovalRequest } from '../../../Models/approvalRequest';
import { PaymentRequestDTO } from '../../../Models/paymentRequest';

@Injectable({
  providedIn: 'root'
})
export class ApprovalRequestService {

  private requestUrl = 'https://localhost:7220/api/Request';

  constructor(private http: HttpClient) {}

  // Add Member Request
  createAddMemberRequest(formData: FormData): Observable<string> {
    return this.http.post<string>(`${this.requestUrl}/add-member`, formData, {
      responseType: 'text' as 'json',
    });
  }

  // Change Member Info Request
  createChangeMemberInfoRequest(formData: FormData): Observable<string> {
    return this.http.post<string>(`${this.requestUrl}/change-member-info`, formData, {
      responseType: 'text' as 'json',
    });
  }

  // Payment Request
  createPaymentRequest(newPayment: PaymentRequestDTO): Observable<PaymentRequest> {
    return this.http.post<PaymentRequest>(`${this.requestUrl}/payment`, newPayment);
  }
  

  // Program Addon Request
  createProgramAddonRequest(newProgramAddon: ProgramAddonRequestDTO): Observable<ProgramAddonRequest> {
    return this.http.post<ProgramAddonRequest>(`${this.requestUrl}/program-addon`, newProgramAddon);
  }
  

  // Leave Program Request
  createLeaveProgramRequest(newLeaveProgram: LeaveProgramRequestDTO): Observable<LeaveProgramRequest> {
    return this.http.post<LeaveProgramRequest>(`${this.requestUrl}/leave-program`, newLeaveProgram);
  }
  

  // Get Payment Requests
  getPaymentRequests(pageNumber: number, pageSize: number): Observable<PaginationResponse<any>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginationResponse<any>>(`${this.requestUrl}/payment-requests`, { params });
  }

  // Get Member Info Change Requests
  getMemberInfoChangeRequests(pageNumber: number, pageSize: number): Observable<PaginationResponse<NewOrChangeMemberRequest>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginationResponse<any>>(`${this.requestUrl}/member-info-change-requests`, { params });
  }

  // Get New Member Requests
  getNewMemberRequests(pageNumber: number, pageSize: number): Observable<PaginationResponse<NewOrChangeMemberRequest>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginationResponse<any>>(`${this.requestUrl}/new-member-requests`, { params });
  }

  // Get Leave Program Requests
  getLeaveProgramRequests(pageNumber: number, pageSize: number): Observable<PaginationResponse<LeaveProgramRequest>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginationResponse<any>>(`${this.requestUrl}/leave-program-requests`, { params });
  }

  // Get Program Addon Requests
  getProgramAddonRequests(pageNumber: number, pageSize: number): Observable<PaginationResponse<ProgramAddonRequest>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginationResponse<any>>(`${this.requestUrl}/program-addon-requests`, { params });
  }

  // Get All Requests
  getAllRequests(pageNumber: number, pageSize: number): Observable<PaginationResponse<ApprovalRequest>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginationResponse<any>>(`${this.requestUrl}/get-all`, { params });
  }

  // Get Specific Request by ID
  getRequestById(requestId: number): Observable<ApprovalRequest> {
    return this.http.get<any>(`${this.requestUrl}/${requestId}`);
  }

  // Update Request by ID
  updateRequest(requestId: number, formData: FormData): Observable<ApprovalRequest> {
    return this.http.put<any>(`${this.requestUrl}/${requestId}`, formData);
  }
}

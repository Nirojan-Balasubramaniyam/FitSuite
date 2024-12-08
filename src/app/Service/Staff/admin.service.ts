import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch } from '../../Models/branch';
import { PaginationResponse } from '../../Models/pagination';
import { Member } from '../../Models/member';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private branchUrl = 'https://localhost:7220/api/Branch';
  private memberUrl = 'https://localhost:7220/api/Member';

  constructor(private http: HttpClient) { }

  getAllBranches() {
    return this.http.get<PaginationResponse<Branch>>(this.branchUrl);
  }

  createBranch(Branch: Branch) {
    return this.http.post(this.branchUrl, Branch);
  }

  deleteBranch(BranchId: number) {
    return this.http.delete(this.branchUrl + '/' + BranchId);
  }

  getBranch(BranchId: number) {
    return this.http.get<Branch>(this.branchUrl + '/' + BranchId);
  }

  updateBranch(Branch: Branch, BranchId: number) {
    return this.http.put(this.branchUrl + '/' + BranchId, Branch);
  }

  //Member Api

  getAllMembers(pageNumber: number, pageSize: number): Observable<PaginationResponse<Member>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginationResponse<Member>>(this.memberUrl, { params });
  }

  createMember(formData: FormData): Observable<string> {
    return this.http.post<string>(this.memberUrl, formData, {
      responseType: 'text' as 'json'  // Ensure the response is treated as plain text
    });
  }
 
  getMember(memberId: number) {
    return this.http.get<Member>(`${this.memberUrl}/${memberId}`);
  }

  updateMember(member: Member, memberId: number) {
    return this.http.put(`${this.memberUrl}/${memberId}`, member);
  }

 
  deleteMember(memberId: number) {
    return this.http.delete(`${this.memberUrl}/${memberId}`);
  }

}

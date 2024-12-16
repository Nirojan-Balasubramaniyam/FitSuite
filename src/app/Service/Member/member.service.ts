import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private memberUrl = 'https://localhost:7220/api/Member';

  

  constructor(private http: HttpClient) {}

  // Method to check member's password
  checkMemberPassword(memberId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.memberUrl}/check-password/${memberId}`);
  }

}

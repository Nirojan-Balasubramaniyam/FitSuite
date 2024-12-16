import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../../Models/pagination';
import { Member } from '../../Models/member';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {

  private apiUrl = 'https://localhost:7220/api/WorkoutPlan';
  private enrollApiUrl='https://localhost:7220/api/WorkoutEnrollment';
  private memberUrl = 'https://localhost:7220/api/Member';

  
  constructor(private http: HttpClient) {}

  addWorkoutPlan(workoutPlan: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.apiUrl}`, workoutPlan, { headers });
  }

  getWorkoutPlanById(workoutPlanId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${workoutPlanId}`);
  }

  getAllWorkoutPlans(pageNumber: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  updateWorkoutPlan(workoutPlanId: number, workoutPlan: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${workoutPlanId}`, workoutPlan);
  }

  deleteWorkoutPlan(workoutPlanId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${workoutPlanId}`);
  }


/**
   * Add a new workout enrollment
   * @param workoutEnrollRequest The request payload
   */
addWorkoutEnrollment(workoutEnrollRequest: any): Observable<any> {
  return this.http.post(`${this.enrollApiUrl}`, workoutEnrollRequest);
}

/**
 * Get workout enrollment by ID
 * @param workoutEnrollId The ID of the workout enrollment
 */
getWorkoutEnrollmentById(workoutEnrollId: number): Observable<any> {
  return this.http.get(`${this.enrollApiUrl}/workoutenroll/${workoutEnrollId}`);
}

/**
 * Get workout plans by member ID
 * @param memberId The ID of the member
 */
getWorkoutPlansByMemberId(memberId: number): Observable<any> {
  return this.http.get(`${this.enrollApiUrl}/workout-plans${memberId}`);
}

/**
 * Get all workout enrollments by member ID
 * @param memberId The ID of the member
 */
getWorkoutEnrollmentsByMemberId(memberId: number): Observable<any> {
  return this.http.get(`${this.enrollApiUrl}/${memberId}`);
}

/**
 * Get all workout enrollments with pagination
 * @param pageNumber The page number
 * @param pageSize The page size
 */
getAllWorkoutEnrollments(pageNumber: number, pageSize: number): Observable<any> {
  const params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString());
  return this.http.get(`${this.enrollApiUrl}`, { params });
}

/**
 * Update a workout enrollment
 * @param workoutEnrollId The ID of the workout enrollment
 * @param workoutEnrollRequest The updated data
 */
updateWorkoutEnrollment(workoutEnrollId: number, workoutEnrollRequest: any): Observable<any> {
  return this.http.put(`${this.enrollApiUrl}`, { workoutEnrollId, ...workoutEnrollRequest });
}

/**
 * Delete a workout enrollment
 * @param workoutEnrollId The ID of the workout enrollment
 */
deleteWorkoutEnrollment(workoutEnrollId: number): Observable<any> {
  return this.http.delete(`${this.enrollApiUrl}/${workoutEnrollId}`);
}

 getAllMembers(pageNumber: number, pageSize: number, isActive: boolean, branchId: number): Observable<PaginationResponse<Member>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('isActive', isActive.toString())
      .set('branchId', branchId.toString());

    return this.http.get<PaginationResponse<Member>>(this.memberUrl, { params });
  }
}

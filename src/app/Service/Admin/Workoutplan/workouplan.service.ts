import { Injectable } from '@angular/core';
import { WorkoutPlan } from '../../../Models/workoutPlans';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkouplanService {

  private workoutPlanUrl = 'https://localhost:7220/api/workout-plans';  

  constructor(private http: HttpClient) {}

    // Get payments for a member 
    getWorkoutplansForMember(memberId: number): Observable<WorkoutPlan[]> {
      return this.http.get<WorkoutPlan[]>(`${this.workoutPlanUrl}/${memberId}`);
    }
}
